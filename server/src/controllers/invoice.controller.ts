import Elysia from "elysia";
import InvoiceService from "@/services/invoice.service";
import { invoiceModel } from "@/models/invoice.model";

export const invoiceController = new Elysia({
  name: "Controller.Invoice",
  prefix: "invoice",
})
  .decorate({
    invoiceService: new InvoiceService(),
  })
  .use(invoiceModel)
  .get(
    "/",
    async ({ invoiceService: service, query }) => await service.getAll(query),
    {
      query: "invoice.filter",
    },
  )
  .get(
    "/:byDateId",
    async ({ invoiceService: service, params: { byDateId } }) =>
      await service.getDetail(byDateId),
  )
  .post(
    "/",
    async ({ body, invoiceService: service }) => await service.create(body),
    {
      body: "invoice.create",
    },
  )
  .post(
    "/:byDateId/complete",
    async ({ params: { byDateId }, invoiceService: service }) =>
      await service.complete(byDateId),
  )
  .post(
    "/:byDateId/refund",
    async ({ body, params: { byDateId }, invoiceService: service }) =>
      await service.refund(byDateId, body),
    {
      body: "invoice.refund",
    },
  )
  .post(
    "/:byDateId/delivery",
    async ({ body, params: { byDateId }, invoiceService: service }) =>
      await service.delivery(byDateId, body),
    {
      body: "invoice.delivery",
    },
  );
