import Elysia, { t } from "elysia";

export const categoryModel = new Elysia({
  name: "Model.Category",
}).model({
  "category.create": t.Object({
    uuid: t.String(),
    name: t.String({
      required: true,
    }),
    price: t.Number({
      required: true,
      message: "Nhóm hàng phải có giá",
    }),
  }),
});
