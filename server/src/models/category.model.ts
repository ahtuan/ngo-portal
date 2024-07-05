import Elysia, { Static, t } from "elysia";

const create = t.Object({
  uuid: t.String(),
  name: t.String({
    required: true,
  }),
  price: t.Number({
    required: true,
    message: "Nhóm hàng phải có giá",
  }),
  unit: t.String(),
});

export const categoryModel = new Elysia({
  name: "Model.Category",
}).model({
  "category.create": create,
});

export namespace Category {
  export type Create = Static<typeof create>;
}
