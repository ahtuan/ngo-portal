import Elysia from "elysia";
import InventoryService from "@/services/inventory.service";
import { inventoryModel } from "@/models/inventory.model";
import { pagingModel } from "@/models/paging.model";

export const inventoryController = new Elysia({
  name: "Controller.Inventory",
  prefix: "inventory",
})
  .use(inventoryModel)
  .use(pagingModel)
  .decorate("service", new InventoryService())
  .get("/", async ({ service, query }) => await service.getAll(query), {
    query: "pagination",
  })
  .get("/:id", async ({ service, params: { id } }) => await service.getById(id))
  .post("/", async ({ body, service }) => await service.create(body), {
    body: "inventory.create",
  })
  .patch(
    "/:id",
    async ({ body, service, params: { id } }) => await service.update(id, body),
    {
      body: "inventory.update",
    },
  )
  .delete(
    "/:id",
    async ({ service, params: { id } }) => await service.delete(id),
  )
  .post(
    "/:id/delivery",
    async ({ service, body, params: { id } }) =>
      await service.createDelivery(id, body),
    {
      body: "inventory.delivery",
    },
  );
