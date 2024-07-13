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
});

export namespace Invoice {
  export type RawCreate = z.TypeOf<typeof InvoiceBody>;
  export type DedicatedCreated = {
    totalQuantity: number;
    totalPrice: number;
    afterSale: number;
  } & RawCreate;
  export type ItemType = z.TypeOf<typeof InvoiceItems>;
  export type StackItemType = z.TypeOf<typeof Stack>;
  export type Type = {
    byDateId: string;
    paymentMethod: string;
    price: number;
    createdAt: string;
    createdBy: string;
  };
  export type Detail = {
    byDateId: string;
    createdAt: string;
  } & DedicatedCreated;

  export type Sale = z.TypeOf<typeof SaleBody>;
}
