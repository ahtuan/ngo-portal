import Elysia from "elysia";
import ProductService from "@/services/product.service";
import { productModel } from "@/models/product.model";

export const productController = new Elysia({
  name: "Controller.Product",
  prefix: "product",
})
  .decorate("productService", new ProductService())
  .use(productModel)
  .get(
    "/",
    async ({ productService, query }) => await productService.getAll(query),
    {
      query: "product.filter",
    },
  )
  .get(
    "/:byDateId",
    async ({ productService, params: { byDateId } }) =>
      await productService.getDetail(byDateId),
  )
  .post(
    "/",
    async ({ body, productService }) => await productService.create(body),
    {
      body: "product.create",
    },
  )
  .post(
    "/print-barcode",
    async ({ body, productService }) => await productService.printBarcode(body),
    {
      body: "product.printBarcode",
    },
  )
  .patch(
    "/:byDateId",
    async ({ body, productService, params: { byDateId } }) =>
      await productService.update(byDateId, body),
    {
      body: "product.update",
    },
  )
  .delete(
    "/:byDateId",
    async ({ productService, params: { byDateId } }) =>
      await productService.delete(byDateId),
  );
