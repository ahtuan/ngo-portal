import Elysia, { t } from "elysia";

export const productModel = new Elysia({
  name: "Model.Product",
}).model({
  "product.create": t.Object({
    name: t.String(),
    description: t.Optional(t.String()),
    price: t.Number({
      required: true,
      message: "Mặt hàng phải có đơn giá",
    }),
    imageUrl: t.Optional(t.String()),
    weight: t.Number({
      message: "Mặt hàng phải có khối lượng",
    }),
  }),
  "product.update": t.Partial(
    t.Object({
      name: t.String(),
      description: t.String(),
      price: t.Number(),
      imageUrl: t.String(),
      weight: t.Number(),
    }),
  ),
});
