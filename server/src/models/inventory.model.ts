import Elysia, { t } from "elysia";

const body = t.Object({
  price: t.Number({
    required: true,
    message: "Lô hàng phải có đơn giá",
  }),
  grossWeight: t.String({
    message: "Lô hàng phải có khối lượng",
  }),
  source: t.String({
    message: "Lô hàng phải có xuất xứ",
  }),
  status: t.Optional(t.String()),
  unit: t.Optional(t.String()),
});
export const inventoryModel = new Elysia({
  name: "Model.Inventory",
}).model({
  "inventory.create": body,
  "inventory.update": t.Partial(body),
});
