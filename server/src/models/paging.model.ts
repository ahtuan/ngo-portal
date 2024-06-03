import Elysia, { t } from "elysia";
export const pagingModel = new Elysia({
  name: "Model.Pagination",
}).model({
  pagination: t.Partial(
    t.Object({
      page: t.Number(),
      size: t.Number(),
    }),
  ),
});
