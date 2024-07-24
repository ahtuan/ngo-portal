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
  .decorate("inventoryService", new InventoryService())
  .get(
    "/",
    async ({ inventoryService, query }) => await inventoryService.getAll(query),
    {
      query: "pagination",
    },
  )
  .get(
    "/:id",
    async ({ inventoryService, params: { id } }) =>
      await inventoryService.getById(id),
  )
  .get(
    "detect-inspection",
    async ({ inventoryService }) => await inventoryService.detectInspection(),
  )
  .get(
    "/:id/report",
    async ({ inventoryService, params: { id } }) =>
      await inventoryService.report(id),
  )
  .post(
    "/",
    async ({ body, inventoryService }) => await inventoryService.create(body),
    {
      body: "inventory.create",
    },
  )
  .patch(
    "/:id",
    async ({ body, inventoryService, params: { id } }) =>
      await inventoryService.update(id, body),
    {
      body: "inventory.update",
    },
  )
  .delete(
    "/:id",
    async ({ inventoryService, params: { id } }) =>
      await inventoryService.delete(id),
  );
