import Elysia from "elysia";
import { pagingModel } from "@/models/paging.model";
import SaleService from "@/services/sale.service";
import { saleModel } from "@/models/sale.model";

export const saleController = new Elysia({
  name: "Controller.Sale",
  prefix: "sale",
})
  .decorate("saleService", new SaleService())
  .use(saleModel)
  .use(pagingModel)
  .get(
    "/",
    async ({ saleService: service, query }) => await service.getAll(query),
    {
      query: "pagination",
    },
  )
  .post(
    "/",
    async ({ body, saleService: service }) => await service.create(body),
    {
      body: "sale.create",
    },
  )
  .patch(
    "/:id",
    async ({ body, saleService: service, params: { id } }) =>
      await service.update(id, body),
    {
      body: "sale.update",
    },
  )
  .delete(
    "/:id",
    async ({ saleService: service, params: { id } }) =>
      await service.delete(id),
  );
