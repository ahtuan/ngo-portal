import http from "@/lib/http";
import { Invoice } from "@/schemas/invoice.schema";

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
  create: async (data: Invoice.RawCreate) => http.post(invoiceEndpoint, data),
  complete: async (byDateId: string) =>
    http.post(`${invoiceEndpoint}/${byDateId}/complete`, undefined),
  refund: async (byDateId: string, body: any) =>
    http.post(`${invoiceEndpoint}/${byDateId}/refund`, body),
};
