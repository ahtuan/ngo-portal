import Elysia, { Static, t } from "elysia";
import { PAYMENT_METHOD_ENUM } from "@/constants/common";

const filter = t.Partial(
  t.Object({
    keyword: t.String(),
    page: t.String(),
    size: t.String(),
  }),
);
const SaleCampaign = t.Object({
  uuid: t.String(),
  name: t.String(),
  description: t.Optional(t.Union([t.String(), t.Null()])),
  price: t.Union([t.Number(), t.Null()]),
  condition: t.Union([t.String(), t.Null()]),
  steps: t.String(),
  isApplied: t.Optional(t.Boolean()),
});

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
  sale: t.Optional(SaleCampaign),
});

const StackItem = t.Object({
  name: t.String(),
  categoryUuidByKg: t.String(),
  weight: t.Number(),
  price: t.Number(),
  total: t.Number(),
  items: t.Array(InvoiceItem),
  sale: t.Optional(SaleCampaign),
});

const create = t.Object({
  paymentType: t.Enum(PAYMENT_METHOD_ENUM),
  actualPrice: t.Number({
    minimum: 1000,
    message: "Đơn hàng phải có giá trị",
  }),
  items: t.Optional(t.Array(InvoiceItem)),
  stacks: t.Optional(t.Array(StackItem)),
  sale: t.Optional(SaleCampaign),
  isOnline: t.Optional(t.Boolean()),
  deposit: t.Optional(t.Number()),
});

const refund = t.Object({
  amount: t.Number({
    minimum: 1000,
    message: "Hoàn tiền cần phải lớn hơn 1000",
  }),
  note: t.Optional(t.String()),
});

const delivery = t.Object({
  orderCode: t.String(),
  shippingFee: t.Optional(t.Union([t.Number(), t.Null()])),
  paymentMethod: t.Optional(t.Enum(PAYMENT_METHOD_ENUM)),
});

export const invoiceModel = new Elysia({
  name: "Model.Invoice",
}).model({
  "invoice.filter": filter,
  "invoice.create": create,
  "invoice.refund": refund,
  "invoice.delivery": delivery,
});

export namespace Invoice {
  export type Filter = Static<typeof filter>;
  export type Create = Static<typeof create>;
  export type Item = Static<typeof InvoiceItem>;
  export type Refund = Static<typeof refund>;
  export type Delivery = Static<typeof delivery>;
}
