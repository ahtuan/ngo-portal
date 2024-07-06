import Elysia from "elysia";
import InvoiceService from "@/services/invoice.service";
import { invoiceModel } from "@/models/invoice.model";

export const invoiceController = new Elysia({
  name: "Controller.Invoice",
  prefix: "invoice",
})
  .decorate({
    invoiceServer: new InvoiceService(),
  })
  .use(invoiceModel)
  .get(
    "/",
    async ({ invoiceServer: service, query }) => await service.getAll(query),
    {
      query: "invoice.filter",
    },
  )
  .get(
    "/:byDateId",
    async ({ invoiceServer: service, params: { byDateId } }) =>
      await service.getDetail(byDateId),
  )
  .post(
    "/",
    async ({ body, invoiceServer: service }) => await service.create(body),
    {
      body: "invoice.create",
    },
  );
