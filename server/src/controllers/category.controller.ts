import Elysia from "elysia";
import CategoryService from "@/services/category.service";
import { categoryModel } from "@/models/category.model";
import { pagingModel } from "@/models/paging.model";

export const categoryController = new Elysia({
  name: "Controller.Category",
  prefix: "category",
})
  .decorate("service", new CategoryService())
  .use(categoryModel)
  .use(pagingModel)
  .get("/", async ({ service, query }) => await service.getAll(query), {
    query: "pagination",
  })
  .get("/:id", async ({ service, params: { id } }) => await service.getById(id))
  .post("/", async ({ body, service }) => await service.create(body), {
    body: "category.create",
  })
  .patch(
    "/:id",
    async ({ body, service, params: { id } }) => await service.update(id, body),
    {
      body: "category.update",
    },
  )
  .delete(
    "/:id",
    async ({ service, params: { id } }) => await service.delete(id),
  );
