import Elysia from "elysia";
import CategoryService from "@/services/category.service";
import { categoryModel } from "@/models/category.model";
import { pagingModel } from "@/models/paging.model";

export const categoryController = new Elysia({
  name: "Controller.Category",
  prefix: "category",
})
  .decorate("categoryService", new CategoryService())
  .use(categoryModel)
  .use(pagingModel)
  .get(
    "/",
    async ({ categoryService, query }) => await categoryService.getAll(query),
    {
      query: "pagination",
    },
  )
  .get(
    "/:id",
    async ({ categoryService, params: { id } }) =>
      await categoryService.getById(id),
  )
  .post(
    "/",
    async ({ body, categoryService }) => await categoryService.upsert(body),
    {
      body: "category.create",
    },
  )
  .delete(
    "/:id",
    async ({ categoryService, params: { id } }) =>
      await categoryService.delete(id),
  );
