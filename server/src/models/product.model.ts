import Elysia, { t } from "elysia";

export const productModel = new Elysia({
  name: "Model.Product",
}).model({
  "product.create": t.Object({
    name: t.String({
      message: "Mặt hàng phải có tên",
    }),
    inventoryId: t.String({
      message: "Phải có thông tin lô hàng đang được soạn",
    }),
    description: t.Optional(t.String()),
    price: t.Number({
      required: true,
      message: "Mặt hàng phải có đơn giá",
    }),
    imageUrls: t.Optional(t.Array(t.String())),
    weight: t.Number({
      message: "Mặt hàng phải có khối lượng",
    }),
    categoryUuid: t.String(),
    isUsedCategoryPrice: t.Boolean(),
    status: t.String(),
  }),
  "product.update": t.Partial(
    t.Object({
      name: t.String(),
      inventoryId: t.String(),
      description: t.String(),
      price: t.Number(),
      imageUrls: t.String(),
      weight: t.Number(),
      categoryUuid: t.String(),
      isUsedCategoryPrice: t.Boolean(),
      status: t.String(),
    }),
  ),
  "product.filter": t.Partial(
    t.Object({
      page: t.String(),
      category: t.String(),
      keyword: t.String(),
      status: t.String(),
      size: t.String(),
    }),
  ),
});
