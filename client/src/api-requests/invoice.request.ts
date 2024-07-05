import http from "@/lib/http";
import { InvoiceCreate } from "@/schemas/invoice.schema";

export const invoiceEndpoint = "/api/invoice";
export const invoiceRequest = {
  getAll: async (queryString: string) => {
    const response = await http.get<Common.Paging<any>>(
      invoiceEndpoint + `?${queryString}`,
    );
    return response.data;
  },
  getDetail: async (byDateId: string) => {
    const response = await http.get<any>(invoiceEndpoint + "/" + byDateId);
    return response.data;
  },
  create: async (data: InvoiceCreate) => http.post(invoiceEndpoint, data),
};
