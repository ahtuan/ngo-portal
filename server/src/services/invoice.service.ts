import { Invoice } from "@/models/invoice.model";
import { ApiResponse } from "@/libs/api-response";
import db from "@/db";
import {
  invoiceItems,
  InvoiceItemSchema,
  InvoiceResponse,
  invoices,
  payments,
} from "@/db/schemas/invoice.schema";
import {
  DEFAULT_PAGING,
  INVOICE_STATUS_ENUM,
  PAYMENT_METHOD_ENUM,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
} from "@/constants/common";
import ProductService from "@/services/product.service";
import CategoryService from "@/services/category.service";
import { and, desc, eq, gte, inArray, like, lte, or, sql } from "drizzle-orm";
import { helperService } from "@/services/helper.service";
import { NotFoundError } from "@/libs/error";
import SaleService from "@/services/sale.service";
import { evaluateExp, fixed } from "@/libs/helpers";
import { getCurrentDate } from "@/libs/date";
import DeliveryService from "@/services/delivery.service";
import dayjs from "dayjs";
import { products } from "@/db/schemas/product.schema";
import { byKgCategories } from "@/db/schemas/category.schema";

class InvoiceService {
  private productService: ProductService;
  private categoryService: CategoryService;
  private saleService: SaleService;
  private deliveryService: DeliveryService;

  constructor() {
    this.productService = new ProductService();
    this.categoryService = new CategoryService();
    this.saleService = new SaleService();
    this.deliveryService = new DeliveryService();
  }

  async getAll(query: Invoice.Filter) {
    const limit = query.size ? +query.size : DEFAULT_PAGING.size;
    const offset = query.page ? +query.page - 1 : DEFAULT_PAGING.page;
    const { from, to } = query;

    const statusCollection = (query.status?.split(";") || [])
      .map((category) => `'${category.toUpperCase()}'`)
      .join(",");
    const isOnline =
      query.isOnline === "all" || query.isOnline === undefined
        ? undefined
        : query.isOnline === "true";
    const sq = db.$with("sq").as(
      db
        .select()
        .from(invoices)
        .where(
          and(
            query.keyword
              ? or(
                  like(invoices.byDateId, `%${query.keyword}%`),
                  like(invoices.orderCode, `%${query.keyword.toUpperCase()}%`),
                )
              : undefined,
            isOnline !== undefined
              ? eq(invoices.isOnline, isOnline)
              : undefined,
            query.status
              ? sql`${invoices.status} in ${sql.raw(`(${statusCollection})`)}`
              : undefined,
            from
              ? to
                ? gte(
                    invoices.createdAt,
                    dayjs(from).utc(true).startOf("day").toDate(),
                  )
                : and(
                    gte(
                      invoices.createdAt,
                      dayjs(from).utc(true).startOf("day").toDate(),
                    ),
                    lte(
                      invoices.createdAt,
                      dayjs(from).utc(true).endOf("day").toDate(),
                    ),
                  )
              : undefined,
            to
              ? lte(
                  invoices.createdAt,
                  dayjs(to).utc(true).endOf("day").toDate(),
                )
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
    const mappedData: InvoiceResponse.Invoice[] = await Promise.all(
      data.map(async (item) => {
        const payments = await this.getPayments(item.id);

        return {
          ...item,
          payments,
        };
      }),
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
      data: mappedData,
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
          if (!price && !categoryPrice && product.categoryId) {
            // Because of this case just happen if product not selling by kg
            // due to categoryPrice have value
            const category = await this.categoryService.getById(
              product.categoryId,
              false,
            );
            if (category) {
              price = category.price;
            }
          }
          const stock = product.quantity - product.soldOut;
          price = price || categoryPrice || 0;
          return {
            name: product.name,
            byDateId: product.byDateId,
            price,
            afterSale: price,
            total: current.price,
            quantity: +current.quantity,
            weight: +product.weight,
            originalStock: stock + +current.quantity,
            stock: stock,
            unit: product.categoryIdByKg ? "KG" : "CHIẾC",
            image: (
              await helperService.readImages(product.imageUrls ?? "", true)
            )[0],
            cost: product.cost,
          };
        }
      };

      const { totalPrice, totalQuantity, stacks, items, totalCost } =
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
              let item = await getItems(current);
              if (item) {
                result.totalCost += item.cost * +current.quantity;
                item.price = fixed(current.price / (item?.quantity || 1), 0); // if have change on the price => must be cal again
                result.items.push(item);
              }
            }
            // for case item sell by Kg (handle for parent row)
            else if (current.categoryId) {
              const category = await this.categoryService.getById(
                current.categoryId,
                true,
              );
              if (category) {
                const total = fixed(+current.quantity * current.price);
                // Quantity place as weight
                const sale = current.saleId
                  ? await this.saleService.getById(current.saleId)
                  : undefined;
                const afterSale = sale?.steps
                  ? evaluateExp(sale.steps, {
                      price: current.price,
                      quantity: +current.quantity,
                    }) || total
                  : total;
                result.totalPrice += afterSale;
                result.stacks.push({
                  id: current.id,
                  categoryUuidByKg: category.uuid,
                  name: category.name,
                  weight: +current.quantity,
                  price: current.price,
                  total,
                  items: [],
                  sale: sale
                    ? {
                        name: sale.name,
                        description: sale.description,
                        condition: sale.condition,
                        steps: sale.steps,
                        isApplied: true,
                      }
                    : undefined,
                  afterSale: fixed(afterSale),
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
                  result.totalCost += item.cost * +current.quantity;
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
            sale: undefined,
            totalCost: 0,
          } as {
            totalPrice: number;
            totalQuantity: number;
            items: InvoiceResponse.InvoiceItem[];
            stacks: InvoiceResponse.StackItem[];
            sale?: InvoiceResponse.Sale;
            totalCost: number;
          }),
        );
      const sale = invoice.saleId
        ? await this.saleService.getById(invoice.saleId)
        : undefined;

      const afterSale = sale?.steps
        ? evaluateExp(sale.steps, {
            price: totalPrice,
          }) || totalPrice
        : totalPrice;
      const payments = await this.getPayments(invoice.id);
      let deliveryInfo: InvoiceResponse.Delivery | undefined = undefined;
      if (invoice.isOnline && invoice.orderCode) {
        deliveryInfo = await this.deliveryService.getDeliveryInfo(
          invoice.orderCode,
        );
      }
      const mapping: InvoiceResponse.Detail = {
        byDateId: invoice.byDateId,
        createdAt: invoice.createdAt,
        actualPrice: invoice.price,
        totalPrice,
        totalQuantity,
        items,
        stacks,
        sale: sale
          ? {
              name: sale.name,
              description: sale.description,
              condition: sale.condition,
              steps: sale.steps,
              isApplied: true,
            }
          : undefined,
        afterSale: fixed(afterSale),
        status: invoice.status,
        payments,
        isOnline: invoice.isOnline,
        orderCode: invoice.orderCode,
        deliveryInfo,
        totalCost,
      };

      return ApiResponse.success(mapping);
    }
    return new NotFoundError();
  }

  async create(body: Invoice.Create) {
    const { items, stacks, isOnline } = body;
    const byDateId = await this.getIdSequence();
    try {
      await db.transaction(async (transaction) => {
        try {
          const invoiceSaleId =
            body.sale?.uuid && body.sale.isApplied
              ? (await this.saleService.getById(body.sale.uuid))?.id
              : null;

          // Add invoice and get Id
          const { invoiceId } = (
            await db
              .insert(invoices)
              .values({
                byDateId,
                price: body.actualPrice,
                isOnline,
                status: isOnline
                  ? INVOICE_STATUS_ENUM.PREPARED
                  : INVOICE_STATUS_ENUM.COMPLETE,
                saleId: invoiceSaleId,
              })
              .returning({
                invoiceId: invoices.id,
              })
          )[0];

          // Add invoice item with PCS
          if (items?.length) {
            await this.insertItems(items, invoiceId);
          }

          // Add invoice item with KG
          if (stacks?.length) {
            for (const stack of stacks) {
              const categoryId = (
                await this.categoryService.getById(stack.categoryUuidByKg, true)
              )?.id;
              const stackSaleId =
                stack.sale?.uuid && stack.sale.isApplied
                  ? (await this.saleService.getById(stack.sale.uuid))?.id
                  : null;

              const { parentId } = (
                await db
                  .insert(invoiceItems)
                  .values({
                    invoiceId,
                    quantity: stack.weight.toString(),
                    price: stack.price,
                    categoryId,
                    productId: null,
                    saleId: stackSaleId,
                  })
                  .returning({
                    parentId: invoiceItems.id,
                  })
              )[0];
              await this.insertItems(stack.items, invoiceId, parentId);
            }
          }

          // Add payment method
          const amountLeft = body.actualPrice - (body.deposit || 0);
          let paymentsData: Array<InvoiceResponse.InsertPayment> = [
            {
              invoiceId,
              amount: isOnline ? body.deposit || 0 : body.actualPrice,
              status: PAYMENT_STATUS.COMPLETE,
              paymentType:
                isOnline && amountLeft > 0
                  ? PAYMENT_TYPE.DEPOSIT
                  : PAYMENT_TYPE.FULL,
              paymentDate: getCurrentDate(),
              paymentMethod: body.paymentType,
            },
          ];
          if (isOnline) {
            const remaining = body.actualPrice - (body.deposit || 0);
            if (remaining > 0) {
              paymentsData.push({
                invoiceId,
                amount: remaining,
                status: PAYMENT_STATUS.PENDING,
                paymentType: PAYMENT_TYPE.REMAINING,
                paymentMethod: PAYMENT_METHOD_ENUM.BANK,
              });
            }
          }

          await db.insert(payments).values(paymentsData);
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

  async update(byDateId: string, body: Invoice.Create) {
    const invoice = await this.getById(byDateId);

    if (!invoice) {
      return new NotFoundError("Không tìm thấy mã đơn hàng");
    }
    const invoiceId = invoice.id;
    console.info("Start update invoice with invoice id: ", invoiceId);
    console.debug("Payload with body: ", body);
    const { items, stacks, actualPrice } = body;
    try {
      await db.transaction(async (transaction) => {
        try {
          // Update amount in invoices table
          await db
            .update(invoices)
            .set({
              price: actualPrice,
            })
            .where(eq(invoices.id, invoice.id));
          console.info("Update invoice with new price: ", actualPrice);

          // Select items stored in table
          const invoiceItemsRaw: InvoiceResponse.InvoiceItemRaw[] = await db
            .select({
              id: invoiceItems.id,
              parentId: invoiceItems.parentId,
              quantity: invoiceItems.quantity,
              price: invoiceItems.price,
              productId: invoiceItems.productId,
              byDateId: products.byDateId,
              categoryId: invoiceItems.categoryId,
              byKgUuid: byKgCategories.uuid,
            })
            .from(invoiceItems)
            .where(eq(invoiceItems.invoiceId, invoiceId))
            .leftJoin(products, eq(products.id, invoiceItems.productId))
            .leftJoin(
              byKgCategories,
              eq(byKgCategories.id, invoiceItems.categoryId),
            );
          console.debug("Raw invoice items from database: ", invoiceItemsRaw);

          console.info("Start flow update PCS items");
          const itemPromises = this.handleUpdateItems(
            invoiceId,
            invoiceItemsRaw,
            items,
          );
          console.info("End flow update PCS items");
          console.info("Start flow update KG items with stack");
          const currentStackUuidSet = new Set(
            stacks?.map((item) => item.categoryUuidByKg) || [],
          );
          console.info(
            "Current stack Uuid need to be update or insert: ",
            currentStackUuidSet,
          );
          const stacksToDelete = invoiceItemsRaw
            .filter(
              (raw) =>
                raw.byKgUuid !== null && !currentStackUuidSet.has(raw.byKgUuid),
            )
            .map((item) => item.id);
          console.info(
            "Invoice item id need to be deleted (not existed in" +
              " current anymore)",
            stacksToDelete,
          );
          if (stacksToDelete.length > 0) {
            console.info("Start delete unnecessary invoice items");
            await Promise.all(
              stacksToDelete.map(async (id) => {
                console.info("Delete stack items with parent id: ", id);
                const deletedResults = await db
                  .delete(invoiceItems)
                  .where(eq(invoiceItems.parentId, id))
                  .returning();
                console.info(
                  "Update status and soldout for product in stack",
                  id,
                );
                await Promise.all(
                  deletedResults.map((item) => {
                    if (item.productId) {
                      return this.productService.updateAfterInvoice(
                        item.productId,
                        -item.quantity,
                      );
                    }
                  }),
                );
                console.info("Delete stack with id: ", id);
                await db.delete(invoiceItems).where(eq(invoiceItems.id, id));
              }),
            );
            console.info("Complete delete unnecessary invoice items");
          }

          console.debug("Stack items:", stacks);
          const stackPromises = stacks?.length
            ? stacks?.map(async (stack) => {
                const existedStack = invoiceItemsRaw.find(
                  (raw) =>
                    raw.byDateId == null &&
                    raw.byKgUuid === stack.categoryUuidByKg,
                );
                if (existedStack) {
                  console.info(
                    "Update stack with new price and quantity with" +
                      " existed invoice items: ",
                    existedStack.id,
                  );
                  console.debug(
                    "Before update with existed items: ",
                    existedStack,
                  );
                  await db
                    .update(invoiceItems)
                    .set({
                      quantity: stack.weight.toString(),
                      price: stack.price,
                    })
                    .where(eq(invoiceItems.id, existedStack.id));
                  await this.handleUpdateItems(
                    invoiceId,
                    invoiceItemsRaw,
                    stack.items,
                    existedStack.id,
                  );
                } else {
                  const categoryId = (
                    await this.categoryService.getById(
                      stack.categoryUuidByKg,
                      true,
                    )
                  )?.id;
                  console.info(
                    "Insert new stack to database with categoryId: ",
                    categoryId,
                  );
                  const stackSaleId =
                    stack.sale?.uuid && stack.sale.isApplied
                      ? (await this.saleService.getById(stack.sale.uuid))?.id
                      : null;
                  console.info(" And Sale Id", stackSaleId);
                  const { parentId } = (
                    await db
                      .insert(invoiceItems)
                      .values({
                        invoiceId,
                        quantity: stack.weight.toString(),
                        price: stack.price,
                        categoryId,
                        productId: null,
                        saleId: stackSaleId,
                      })
                      .returning({
                        parentId: invoiceItems.id,
                      })
                  )[0];
                  console.info(
                    "Complete insert new stack to invoice items" +
                      " table with id: ",
                    parentId,
                  );
                  await this.insertItems(stack.items, invoiceId, parentId);
                  console.info(
                    "Complete insert stack items to invoice items" +
                      " table with parent id: ",
                    parentId,
                  );
                }
              })
            : [];
          await Promise.all([itemPromises, ...stackPromises]);
          console.info("End of update Stack flow");
          // Update or add more payment
          console.info("Start update payment flow");
          const rawPayments = await db.query.payments.findMany({
            where: (payment, { eq }) => eq(payment.invoiceId, invoice.id),
          });
          console.debug("Current payments in database: ", rawPayments);
          const remainingPaymentExisted = rawPayments.find(
            (item) => item.paymentType === PAYMENT_TYPE.REMAINING,
          );
          console.debug("Payment with Remaining type", remainingPaymentExisted);
          const [sumPayment, charged] = rawPayments.reduce(
            (prev, current) => {
              let [sum, charged] = prev;
              sum += current.amount;
              if (current.status === PAYMENT_STATUS.COMPLETE) {
                return [sum, charged + current.amount];
              }

              return [sum, charged];
            },
            [0, 0],
          );
          console.info(
            "Total payments in database: ",
            sumPayment,
            "and" + " charged: ",
            charged,
          );
          const insertOrUpdatePendingPayment = (
            invoiceId: number,
            amount: number,
            type: string = PAYMENT_TYPE.REMAINING,
            id?: number,
          ) => {
            type = type || PAYMENT_TYPE.REMAINING;
            if (id) {
              console.info(
                "Update payment in database with: ",
                id,
                "and" + " amount: ",
                amount,
              );
              return db
                .update(payments)
                .set({
                  amount: amount,
                })
                .where(eq(payments.id, id));
            }
            console.info(
              "Insert new payment to database with: ",
              id,
              "and" + " amount: ",
              amount,
            );
            return db.insert(payments).values({
              invoiceId,
              amount: amount,
              paymentType: type,
              status: PAYMENT_STATUS.PENDING,
            });
          };

          console.info("Current payment for invoice: ", actualPrice);
          if (actualPrice > sumPayment) {
            console.info(
              "actualPrice > sumPayment - Delete Refund that" +
                " still pending",
            );
            const deletePromise = db
              .delete(payments)
              .where(
                and(
                  eq(payments.invoiceId, invoice.id),
                  eq(payments.paymentType, PAYMENT_TYPE.REFUNDED),
                ),
              );

            let remainingPromise = insertOrUpdatePendingPayment(
              invoice.id,
              actualPrice - charged,
              PAYMENT_TYPE.REMAINING,
              remainingPaymentExisted?.id,
            );
            await Promise.all([deletePromise, remainingPromise]);
            console.info(
              "Complete delete REFUNED payment and update" +
                " remaining amount to database",
            );
          } else if (actualPrice < sumPayment) {
            console.info("actualPrice < sumPayment");
            if (actualPrice > charged) {
              console.info("and actualPrice > charged");
              console.info(
                "Increase Remaining amount from ",
                remainingPaymentExisted?.amount,
                " to ",
                actualPrice - charged,
              );
              await insertOrUpdatePendingPayment(
                invoice.id,
                actualPrice - charged,
                PAYMENT_TYPE.REMAINING,
                remainingPaymentExisted?.id,
              );
            } else if (actualPrice === charged) {
              console.info(
                "and actualPrice = charged - Delete all of remaining amount",
              );
              await db
                .delete(payments)
                .where(
                  and(
                    eq(payments.invoiceId, invoice.id),
                    eq(payments.paymentType, PAYMENT_TYPE.REMAINING),
                  ),
                );
            } else {
              console.info(
                "and actualPrice < charged - Need to refund to" +
                  " customer with amount: ",
                (body.actualPrice - charged) * -1,
              );
              const refundPaymentExisted = rawPayments.find(
                (item) => item.paymentType === PAYMENT_TYPE.REFUNDED,
              );
              await insertOrUpdatePendingPayment(
                invoice.id,
                (body.actualPrice - charged) * -1,
                PAYMENT_TYPE.REFUNDED,
                refundPaymentExisted?.id,
              );
              console.info("Delete remaining payment");
              await db
                .delete(payments)
                .where(
                  and(
                    eq(payments.invoiceId, invoice.id),
                    eq(payments.paymentType, PAYMENT_TYPE.REMAINING),
                  ),
                );
            }
          }
          console.info("Complete update payment for invoice: ", invoiceId);
          console.info("End update invoice flow with id: ", invoiceId);
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

  async complete(byDateId: string, justPayment: boolean = false) {
    const invoice = await this.getById(byDateId);
    if (!invoice) {
      return new NotFoundError("Không tìm thấy mã đơn hàng");
    }

    await db
      .update(payments)
      .set({
        paymentMethod: PAYMENT_METHOD_ENUM.BANK,
        paymentDate: getCurrentDate(),
        status: PAYMENT_STATUS.COMPLETE,
      })
      .where(
        and(
          eq(payments.invoiceId, invoice.id),
          eq(payments.status, PAYMENT_STATUS.PENDING),
        ),
      );
    if (!justPayment) {
      await db
        .update(invoices)
        .set({
          status: INVOICE_STATUS_ENUM.COMPLETE,
          updatedAt: getCurrentDate(),
        })
        .where(eq(invoices.id, invoice.id));
    }

    return ApiResponse.success(undefined);
  }

  async refund(byDateId: string, body: Invoice.Refund) {
    try {
      const invoice = await this.getById(byDateId);
      if (!invoice) {
        return new NotFoundError();
      }
      if (!invoice.isOnline) {
        return ApiResponse.error("Hoàn tiền chỉ áp dụng cho đơn hàng online");
      }
      await db.insert(payments).values({
        invoiceId: invoice.id,
        amount: body.amount * -1,
        paymentDate: getCurrentDate(),
        paymentMethod: PAYMENT_METHOD_ENUM.BANK,
        paymentType: PAYMENT_TYPE.REFUNDED,
        status: PAYMENT_STATUS.REFUNDED,
      });
      await db
        .update(invoices)
        .set({
          status: INVOICE_STATUS_ENUM.REFUNDED,
          note: body.note,
          updatedAt: getCurrentDate(),
        })
        .where(eq(invoices.id, invoice.id));
      return ApiResponse.success();
    } catch (e) {
      return ApiResponse.error(e);
    }
  }

  async delivery(byDateId: string, body: Invoice.Delivery) {
    const invoice = await this.getById(byDateId);
    if (!invoice) {
      return new NotFoundError();
    }
    if (!invoice.isOnline) {
      return ApiResponse.error("Đơn giao hàng chỉ áp dụng cho đơn trực tuyến");
    }
    try {
      await db.transaction(async (transaction) => {
        if (body.shippingFee) {
          await db.insert(payments).values({
            paymentMethod: body.paymentMethod || PAYMENT_METHOD_ENUM.BANK,
            paymentDate: getCurrentDate(),
            status: PAYMENT_STATUS.COMPLETE,
            amount: body.shippingFee * -1,
            invoiceId: invoice.id,
            paymentType: PAYMENT_TYPE.SHIPPING_FEE,
          });
        }
        await db
          .update(invoices)
          .set({
            status: INVOICE_STATUS_ENUM.DELIVERING,
            orderCode: body.orderCode?.trim() ? body.orderCode?.trim() : null,
            updatedAt: getCurrentDate(),
          })
          .where(eq(invoices.id, invoice.id));
      });
      return ApiResponse.success();
    } catch (e) {
      return ApiResponse.error(e);
    }
  }

  async keep(byDateId: string, note?: string) {
    const invoice = await this.getById(byDateId);
    if (!invoice) {
      return new NotFoundError("Không tìm thấy mã đơn hàng");
    }
    try {
      await db
        .update(invoices)
        .set({
          status: INVOICE_STATUS_ENUM.PENDING,
          updatedAt: getCurrentDate(),
          note: note
            ? invoice.note
              ? invoice.note + " " + note
              : note
            : invoice.note,
        })
        .where(eq(invoices.id, invoice.id));
      return ApiResponse.success();
    } catch (e) {
      return ApiResponse.error(e);
    }
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
          const { id: productId, soldOut } = product;
          // TODO Update stock in product table for that product
          result.push({
            invoiceId,
            quantity: current.quantity.toString(),
            price: fixed(current.total, 0),
            productId,
            parentId,
          });
          await this.productService.updateAfterInvoice(
            productId,
            current.quantity + soldOut,
          );
        }
        return result;
      },
      Promise.resolve([] as InvoiceItemSchema[]),
    );
    await db.insert(invoiceItems).values(mapping);
  }

  private async getPayments(invoiceId: number) {
    const payments = await db.query.payments.findMany({
      where: (payment, { eq }) => eq(payment.invoiceId, invoiceId),
      orderBy: (payment, { asc }) => asc(payment.paymentDate),
    });
    return payments;
  }

  private async getById(byDateId: string | number) {
    const data = await db.query.invoices.findFirst({
      where: (invoice, { eq }) =>
        eq(
          typeof byDateId === "string" ? invoice.byDateId : invoice.id,
          byDateId,
        ),
    });
    if (!data) {
      return undefined;
    }
    return data;
  }

  private async handleUpdateItems(
    invoiceId: number,
    oldItems: InvoiceResponse.InvoiceItemRaw[],
    newItems?: Invoice.Item[],
    parentId?: number,
  ) {
    // Delete items that unnecessary
    console.info("Start update invoice items with parentId: ", parentId);
    const currentIdsSet = new Set(newItems?.map((item) => item.byDateId) || []);
    console.info(
      "Current invoice items with byDateId need to be changed: ",
      currentIdsSet,
    );
    const itemsToDelete = oldItems.filter(
      (item) =>
        item.byDateId &&
        (parentId ? item.parentId === parentId : item.parentId === null) &&
        !currentIdsSet.has(item.byDateId),
    );
    console.info(
      "Invoice items with id need to be delete (not" +
        " existed in current anymore): ",
      itemsToDelete,
    );
    if (itemsToDelete.length) {
      const itemIdsToDelete = itemsToDelete.map((item) => item.id);
      console.info("Start delete invoice items with ids: ", itemIdsToDelete);
      const deletedResult = await db
        .delete(invoiceItems)
        .where(inArray(invoiceItems.id, itemIdsToDelete))
        .returning();
      await Promise.all(
        itemsToDelete.map(async (item) => {
          if (item.productId) {
            return this.productService.updateAfterInvoice(
              item.productId,
              -item.quantity,
            );
          }
        }),
      );
      console.info("Complete delete invoice items: ", deletedResult.length);
    }
    console.info(
      "Start update or insert new invoice items to" + " database: ",
      newItems,
    );

    return await Promise.all(
      newItems?.map(async (item) => {
        const { quantity, price, byDateId, total } = item;
        // Check item is existed in invoiceItemsRaw or not
        const existingItem = oldItems.find((raw) => raw.byDateId === byDateId);
        const product = await this.productService.getById(byDateId);
        if (!product?.id) {
          console.warn(`Product with byDateId ${byDateId} not found.`);
          return;
        }

        let productId = existingItem?.productId || product.id;
        let soldOut = 0;

        if (existingItem) {
          soldOut = quantity - +existingItem.quantity + product.soldOut;
          console.info(
            "Update invoice items with existing one and" +
              " calculate soldOut: ",
            soldOut,
          );
          console.debug("Existed invoice item: ", existingItem);
          await db
            .update(invoiceItems)
            .set({
              price: total,
              quantity: quantity.toString(),
            })
            .where(eq(invoiceItems.id, existingItem.id));
          console.info(
            "Complete update invoice item with new price" + " and quantity: ",
          );
        } else {
          console.info("Insert new invoice item with productId: ", productId);
          productId = product.id;
          soldOut = quantity + product.soldOut;
          console.info("Calculate soldOut: ", soldOut);
          await db.insert(invoiceItems).values({
            invoiceId,
            quantity: quantity.toString(),
            price: total,
            productId,
            parentId,
          });
          console.info("Insert completed");
        }

        console.info(
          "Update soldOut to product: ",
          productId,
          "soldOut: ",
          soldOut,
        );
        await this.productService.updateAfterInvoice(productId, soldOut);
        console.info("Complete update product");
      }) || [],
    );
  }
}

export default InvoiceService;
