import Elysia from "elysia";
import ProductService from "@/services/product.service";
import { productModel } from "@/models/product.model";

export const productController = new Elysia({
  name: "Controller.Product",
  prefix: "product",
})
  .decorate("service", new ProductService())
  .use(productModel)
  .get("/", async ({ service, query }) => await service.getAll(query), {
    query: "product.filter",
  })
  .get(
    "/:byDateId",
    async ({ service, params: { byDateId } }) =>
      await service.getDetail(byDateId),
  )
  .post("/", async ({ body, service }) => await service.create(body), {
    body: "product.create",
  })
  .patch(
    "/:byDateId",
    async ({ body, service, params: { byDateId } }) =>
      await service.update(byDateId, body),
    {
      body: "product.update",
    },
  )
  .delete(
    "/:byDateId",
    async ({ service, params: { byDateId } }) => await service.delete(byDateId),
  );
