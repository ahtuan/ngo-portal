import Elysia, { Static, t } from "elysia";

const create = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
  startDate: t.Date(),
  endDate: t.Optional(t.Union([t.Date(), t.Null()])),
  steps: t.String(),
  isActive: t.Boolean(),
  condition: t.String(),
  useForKgCateIds: t.Optional(t.Array(t.String())),
  isInvoiceOnly: t.Boolean(),
});
const update = t.Partial(t.Pick(create, ["isActive", "useForKgCateIds"]));
export const saleModel = new Elysia({
  name: "Model.Sale",
}).model({
  "sale.create": create,
  "sale.update": update,
});

export namespace Sale {
  export type Create = Static<typeof create>;
  export type Update = Static<typeof update>;
}
