import http from "@/lib/http";
import { Invoice } from "@/schemas/invoice.schema";

export const invoiceEndpoint = "/api/invoice";
const removeImages = (items: Invoice.ItemType[]) =>
  items.map((item) => {
    delete item.image;
    return item;
  });

export const invoiceRequest = {
  getAll: async (url: string) => {
    const response = await http.get<Common.Paging<Invoice.Type>>(url);
    return response.data;
  },
  getDetail: async (url: string) => {
    const response = await http.get<Invoice.Detail>(url, {
      cache: "no-cache",
    });
    return response.data;
  },
  create: async (data: Invoice.RawCreate) => {
    const removeImage: Invoice.RawCreate = {
      ...data,
      items: removeImages(data.items),
      stacks: data.stacks?.map((stack) => ({
        ...stack,
        items: removeImages(stack.items),
      })),
    };
    return http.post(invoiceEndpoint, removeImage);
  },
  update: async (byDateId: string, data: Invoice.RawCreate) => {
    const removeImage: Invoice.RawCreate = {
      ...data,
      items: removeImages(data.items),
      stacks: data.stacks?.map((stack) => ({
        ...stack,
        items: removeImages(stack.items),
      })),
    };

    return http.put(`${invoiceEndpoint}/${byDateId}`, removeImage);
  },
  complete: async (byDateId: string) =>
    http.post(`${invoiceEndpoint}/${byDateId}/complete`, undefined),
  refund: async (byDateId: string, body: Invoice.Refund) =>
    http.post(`${invoiceEndpoint}/${byDateId}/refund`, body),
  delivery: async (byDateId: string, body: Invoice.Delivery) =>
    http.post(`${invoiceEndpoint}/${byDateId}/delivery`, body),
  completePayment: async (byDateId: string) =>
    http.post(`${invoiceEndpoint}/${byDateId}/complete-payment`, undefined),
  keep: async (byDateId: string, note?: string) =>
    http.post(`${invoiceEndpoint}/${byDateId}/keep`, { note }),
};
