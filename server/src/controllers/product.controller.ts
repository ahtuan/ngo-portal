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
  .get("/:id", async ({ service, params: { id } }) => await service.getById(id))
  .post("/", async ({ body, service }) => await service.create(body), {
    body: "product.create",
  })
  .patch(
    "/:id",
    async ({ body, service, params: { id } }) => await service.update(id, body),
    {
      body: "product.update",
    },
  )
  .delete(
    "/:id",
    async ({ service, params: { id } }) => await service.delete(id),
  );
