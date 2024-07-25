import { z } from "zod";

const SaleBody = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.number().nullable(),
  condition: z.string().nullable(),
  steps: z.string(),
  isApplied: z.boolean().optional(),
});

const InvoiceItems = z.object({
  byDateId: z.string(),
  name: z.string(),
  quantity: z.number(),
  weight: z.number(),
  price: z.number(),
  total: z.number(),
  category: z.string().optional(), // Name of category following price
  categoryUuid: z.string().optional(), // Can be category by PCS or KG
  unit: z.string(),
  stock: z.number().optional(), // The number of items available
  originalStock: z.number().optional(),
  sale: z.optional(SaleBody),
  afterSale: z.number(),
  image: z.string().optional(),
});

const Stack = z.object({
  name: z.string(),
  categoryUuidByKg: z.string(),
  weight: z.number(),
  price: z.number(),
  total: z.number(),
  afterSale: z.number(),
  items: z.array(InvoiceItems),
  sale: z.optional(SaleBody),
});
export const InvoiceBody = z.object({
  paymentType: z.string().min(1, "Chưa có phương thức thanh toán"),
  items: z.array(InvoiceItems),
  stacks: z.array(Stack).optional(),
  actualPrice: z.coerce.number().min(1, "Đơn hàng phải có giá trị"),
  sale: z.optional(SaleBody),
  isOnline: z.optional(z.boolean()),
  deposit: z.optional(z.coerce.number()),
});

export const InvoiceRefundSchema = z.object({
  amount: z.coerce.number().min(1, "Nhập số tiền cần phải hoàn"),
  note: z.string().optional(),
});

export namespace Invoice {
  export type RawCreate = z.TypeOf<typeof InvoiceBody>;
  export type DedicatedCreated = {
    totalQuantity: number;
    totalPrice: number;
    afterSale: number;
  } & RawCreate;
  export type ItemType = z.TypeOf<typeof InvoiceItems> & {
    image?: string;
  };
  export type StackItemType = z.TypeOf<typeof Stack>;
  type Payment = {
    invoiceId: number;
    paymentMethod: string;
    status: string;
    amount: number;
    paymentType: string;
    paymentDate: string;
  };
  export type Type = {
    byDateId: string;
    payments: Payment[];
    price: number;
    createdAt: string;
    createdBy: string;
    status: string;
    isOnline: boolean;
    note?: string;
  };
  export type Detail = {
    byDateId: string;
    createdAt: string;
    status: string;
    payments: Payment[];
  } & DedicatedCreated;

  export type Sale = z.TypeOf<typeof SaleBody>;
  export type Refund = z.TypeOf<typeof InvoiceRefundSchema>;
}
