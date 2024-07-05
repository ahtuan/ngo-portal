import Elysia, { Static, t } from "elysia";
import { PAYMENT_METHOD_ENUM } from "@/constants/common";

const filter = t.Partial(
  t.Object({
    keyword: t.String(),
  }),
);

const InvoiceItem = t.Object({
  byDateId: t.String(),
  name: t.String(),
  quantity: t.Number(),
  weight: t.Number(),
  price: t.Number(),
  total: t.Number(),
  category: t.Optional(t.String()),
  categoryUuid: t.Optional(t.String()),
  unit: t.String(),
  stock: t.Number(),
  originalStock: t.Number(),
});

const StackItem = t.Object({
  name: t.String(),
  categoryUuidByKg: t.String(),
  weight: t.Number(),
  price: t.Number(),
  total: t.Number(),
  items: t.Array(InvoiceItem),
});

const create = t.Object({
  paymentType: t.Enum(PAYMENT_METHOD_ENUM),
  actualPrice: t.Number({
    minimum: 1000,
    message: "Đơn hàng phải có giá trị",
  }),
  items: t.Optional(t.Array(InvoiceItem)),
  stacks: t.Optional(t.Array(StackItem)),
});

export const invoiceModel = new Elysia({
  name: "Model.Invoice",
}).model({
  "invoice.filter": filter,
  "invoice.create": create,
});

export namespace Invoice {
  export type Filter = Static<typeof filter>;
  export type Create = Static<typeof create>;
  export type Item = Static<typeof InvoiceItem>;
}
