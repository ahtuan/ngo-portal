import Elysia, { t } from "elysia";

export const categoryModel = new Elysia({
  name: "Model.Category",
}).model({
  "category.create": t.Object({
    name: t.String(),
    description: t.Optional(t.String()),
    price: t.Number({
      required: true,
      message: "Nhóm hàng phải có giá",
    }),
  }),
  "category.update": t.Partial(
    t.Object({
      name: t.String(),
      description: t.String(),
      price: t.Number(),
    }),
  ),
});
