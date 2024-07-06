import http from "@/lib/http";
import { Invoice, InvoiceCreate } from "@/schemas/invoice.schema";

export const invoiceEndpoint = "/api/invoice";
export const invoiceRequest = {
  getAll: async (url: string) => {
    const response = await http.get<Common.Paging<Invoice.Type>>(url);
    return response.data;
  },
  getDetail: async (url: string) => {
    const response = await http.get<Invoice.Detail>(url);
    return response.data;
  },
  create: async (data: InvoiceCreate) => http.post(invoiceEndpoint, data),
};
