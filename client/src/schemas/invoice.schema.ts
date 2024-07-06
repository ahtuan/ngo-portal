import { z } from "zod";

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
});

const Stack = z.object({
  name: z.string(),
  categoryUuidByKg: z.string(),
  weight: z.number(),
  price: z.number(),
  total: z.number(),
  items: z.array(InvoiceItems),
});
export const InvoiceBody = z.object({
  paymentType: z.string().min(1, "Chưa có phương thức thanh toán"),
  items: z.array(InvoiceItems),
  stacks: z.array(Stack).optional(),
  actualPrice: z.coerce.number().min(1, "Đơn hàng phải có giá trị"),
});

export type InvoiceCreate = z.TypeOf<typeof InvoiceBody> & {
  totalQuantity: number;
  totalPrice: number;
};

export namespace Invoice {
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
  } & InvoiceCreate;
}
