import Elysia, { t } from "elysia";

export const reportModel = new Elysia({
  name: "Report.Pagination",
}).model({
  period: t.Object({
    from: t.String(),
    to: t.String(),
  }),
});
