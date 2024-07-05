import { Invoice } from "@/models/invoice.model";
import { ApiResponse } from "@/libs/api-response";
import db from "@/db";
import {
  invoiceItems,
  InvoiceItemSchema,
  invoices,
} from "@/db/schemas/invoice.schema";
import { INVOICE_STATUS_ENUM } from "@/constants/common";
import ProductService from "@/services/product.service";
import CategoryService from "@/services/category.service";

class InvoiceService {
  private productService: ProductService;
  private categoryService: CategoryService;

  constructor() {
    this.productService = new ProductService();
    this.categoryService = new CategoryService();
  }

  async getAll(query: Invoice.Filter) {}

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
