import http from "@/lib/http";
import { ClientSale } from "@/schemas/sale.schema";

export const saleEndpoint = "/api/sale";
export const saleRequest = {
  getAll: async (url: string) => {
    const response = await http.get<Common.Paging<ClientSale.Item>>(url);
    return response.data;
  },
  getForInvoiceOnly: async (url: string) => {
    const response = await http.get<Common.Paging<ClientSale.Item>>(url);
    const data = response.data?.data.filter((item) => item.isInvoiceOnly) || [];
    return data;
  },
  create: (data: ClientSale.Create) =>
    http.post<ClientSale.Item>(saleEndpoint, data),
  update: (uuid: string, data: Partial<ClientSale.Update>) =>
    http.patch<ClientSale.Item>(`${saleEndpoint}/${uuid}`, data),
};
