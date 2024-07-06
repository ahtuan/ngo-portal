import { Invoice } from "@/models/invoice.model";
import { ApiResponse } from "@/libs/api-response";
import db from "@/db";
import {
  invoiceItems,
  InvoiceItemSchema,
  InvoiceResponse,
  invoices,
} from "@/db/schemas/invoice.schema";
import { DEFAULT_PAGING, INVOICE_STATUS_ENUM } from "@/constants/common";
import ProductService from "@/services/product.service";
import CategoryService from "@/services/category.service";
import { and, desc, like, or, sql } from "drizzle-orm";
import { helperService } from "@/services/helper.service";
import { NotFoundError } from "@/libs/error";

class InvoiceService {
  private productService: ProductService;
  private categoryService: CategoryService;

  constructor() {
    this.productService = new ProductService();
    this.categoryService = new CategoryService();
  }

  async getAll(query: Invoice.Filter) {
    const limit = query.size ? +query.size : DEFAULT_PAGING.size;
    const offset = query.page ? +query.page - 1 : DEFAULT_PAGING.page;

    const sq = db.$with("sq").as(
      db
        .select()
        .from(invoices)
        .where(
          and(
            query.keyword
              ? or(like(invoices.byDateId, `%${query.keyword}%`))
              : undefined,
          ),
        )
        .orderBy(desc(invoices.updatedAt)),
    );
    const select = db.with(sq).select().from(sq);
    const data = await helperService.withPagination(
      select.$dynamic(),
      offset,
      limit,
    );

    const totalRecord = (
      await db
        .with(sq)
        .select({
          count: sql`count('*')`.mapWith(Number),
        })
        .from(sq)
    )[0].count;
    const totalPage = Math.ceil(totalRecord / limit);

    const response: Common.Paging<InvoiceResponse.Invoice> = {
      page: offset + 1,
      totalPage: totalPage,
      totalRecord: totalRecord,
      size: limit,
      data,
    };
    return ApiResponse.success(response);
  }

  async getDetail(byDateId: string) {
    const invoice = await db.query.invoices.findFirst({
      where: (invoice, { eq }) => eq(invoice.byDateId, byDateId),
    });
    if (invoice) {
      const rawItems = await db.query.invoiceItems.findMany({
        where: (items, { eq }) => eq(items.invoiceId, invoice.id),
      });

      const getItems = async (
        current: InvoiceResponse.InvoiceItemSelect,
        categoryPrice?: number,
      ) => {
        const { productId } = current;
        if (!productId) {
          return undefined;
        }
        const product = await this.productService.getById(productId);
        if (product) {
          let price = product.price;
          // Product use category price
          product.id === 5 && console.log(product);
          if (!price && !categoryPrice && product.categoryId) {
            // Because of this case just happen if product not selling by kg
            // due to categoryPrice have value
            const category = await this.categoryService.getById(
              product.categoryId,
              false,
            );
            console.log("here", category);
            if (category) {
              price = category.price;
            }
          }
          return {
            name: product.name,
            byDateId: product.byDateId,
            price: price || categoryPrice || 0,
            total: current.price,
            quantity: +current.quantity,
            weight: +product.weight,
          };
        }
      };

      const { totalPrice, totalQuantity, stacks, items } =
        await rawItems.reduce(
          async (prev, current) => {
            const result = await prev;

            // For case items with PCS only
            if (
              !current.categoryId &&
              !current.parentId &&
              +current.quantity &&
              current.productId
            ) {
              result.totalQuantity += +current.quantity;
              result.totalPrice += current.price;
              const item = await getItems(current);
              if (item) {
                result.items.push(item);
              }
            }
            // for case item sell by Kg
            else if (current.categoryId) {
              const category = await this.categoryService.getById(
                current.categoryId,
                true,
              );
              if (category) {
                const total = +current.quantity * current.price;
                result.totalPrice += total; // Quantity place as weight

                result.stacks.push({
                  id: current.id,
                  name: category.name,
                  weight: +current.quantity,
                  price: current.price,
                  total,
                  items: [],
                });
              }
            }
            // handle for case item in category group of kg
            else if (current.parentId) {
              const stack = result.stacks.find(
                (item) => item.id === current.parentId,
              );
              if (stack) {
                const item = await getItems(current, stack.price);
                if (item) {
                  result.totalQuantity += +current.quantity;
                  stack.items.push(item);
                }
              }
            }
            return prev;
          },
          Promise.resolve({
            totalPrice: 0,
            totalQuantity: 0,
            items: [],
            stacks: [],
          } as {
            totalPrice: number;
            totalQuantity: number;
            items: InvoiceResponse.InvoiceItem[];
            stacks: InvoiceResponse.StackItem[];
          }),
        );
      const mapping: InvoiceResponse.Detail = {
        byDateId: invoice.byDateId,
        createdAt: invoice.createdAt,
        actualPrice: invoice.price,
        paymentType: invoice.paymentMethod,
        totalPrice,
        totalQuantity,
        items,
        stacks,
      };
      return ApiResponse.success(mapping);
    }
    return new NotFoundError();
  }

  async create(body: Invoice.Create) {
    const { items, stacks } = body;
    const byDateId = await this.getIdSequence();
    try {
      await db.transaction(async (transaction) => {
        try {
          const { invoiceId } = (
            await db
              .insert(invoices)
              .values({
                byDateId,
                price: body.actualPrice,
                paymentMethod: body.paymentType,
                status: INVOICE_STATUS_ENUM.COMPLETE,
              })
              .returning({
                invoiceId: invoices.id,
              })
          )[0];
          if (items?.length) {
            await this.insertItems(items, invoiceId);
          }

          if (stacks?.length) {
            for (const stack of stacks) {
              const categoryId = (
                await this.categoryService.getById(stack.categoryUuidByKg, true)
              )?.id;
              const { parentId } = (
                await db
                  .insert(invoiceItems)
                  .values({
                    invoiceId,
                    quantity: stack.weight.toString(),
                    price: stack.price,
                    categoryId,
                    productId: null,
                  })
                  .returning({
                    parentId: invoiceItems.id,
                  })
              )[0];
              await this.insertItems(stack.items, invoiceId, parentId);
            }
          }
        } catch (error) {
          console.error(error);
          transaction.rollback();
          throw error;
        }
      });
    } catch (error) {
      return ApiResponse.error("Có lỗi xảy ra trong quá trình tạo đơn hàng");
    }
    return ApiResponse.success(byDateId);
  }

  private async getIdSequence() {
    const todayString = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD format

    const lasted = await db.query.invoices.findFirst({
      where: (record, { like }) => like(record.byDateId, `GOM${todayString}%`),
      orderBy: (record, { desc }) => [desc(record.createdAt)],
    });
    let sequence = 1;
    if (lasted) {
      sequence = +lasted.byDateId.slice(11, 15) + 1;
    }
    return `GOM${todayString}${sequence.toString().padStart(4, "0")}`;
  }

  private async insertItems(
    list: Invoice.Item[],
    invoiceId: number,
    parentId?: number,
  ) {
    const mapping = await list.reduce(
      async (prevPromise, current) => {
        const result = await prevPromise;
        const product = await this.productService.getById(current.byDateId);
        if (product) {
          const { id: productId, quantity, soldOut } = product;
          // TODO Update stock in product table for that product
          result.push({
            invoiceId,
            quantity: current.quantity.toString(),
            price: current.total,
            productId,
            parentId,
          });
          await this.productService.updateAfterInvoice(
            productId,
            quantity,
            current.quantity + soldOut,
          );
        }
        return result;
      },
      Promise.resolve([] as InvoiceItemSchema[]),
    );
    await db.insert(invoiceItems).values(mapping);
  }
}

export default InvoiceService;
