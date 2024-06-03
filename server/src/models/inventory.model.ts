import Elysia, { t } from "elysia";

export const inventoryModel = new Elysia({
  name: "Model.Inventory",
}).model({
  "inventory.create": t.Object({
    name: t.String(),
    description: t.Optional(t.String()),
    price: t.Number({
      required: true,
      message: "Lô hàng phải có đơn giá",
    }),
    grossWeight: t.Number({
      message: "Lô hàng phải có khối lượng",
    }),
    source: t.String({
      message: "Lô hàng phải có xuất xứ",
    }),
    status: t.Optional(t.String()),
    unit: t.Optional(t.String()),
  }),
  "inventory.update": t.Partial(
    t.Object({
      name: t.String(),
      price: t.Number(),
      grossWeight: t.Number(),
      actualWeight: t.Number(),
      unit: t.String(),
      status: t.String(),
    }),
  ),
  "inventory.delivery": t.Object({
    note: t.Optional(t.String()),
    date: t.Date({
      message: "Thông tin phải có ngày tháng",
    }),
  }),
});
