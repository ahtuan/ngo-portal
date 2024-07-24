import { InventorySubmit, InventoryType } from "@/schemas/inventory.schema";
import http from "@/lib/http";

export const inventoryEndpoint = "/api/inventory";
export const inventoryRequest = {
  getALL: async () => {
    const response = await http.get<InventoryType[]>(inventoryEndpoint);
    return response.data;
  },
  getById: async (url: string) => {
    url = url.includes(inventoryEndpoint) ? url : `${inventoryEndpoint}/${url}`;
    const response = await http.get<InventoryType>(url);
    return response.data;
  },
  create: (data: InventorySubmit) =>
    http.post<InventoryType>(inventoryEndpoint, data),
  update: (id: string, data: Partial<InventorySubmit>) =>
    http.patch<InventoryType>(`${inventoryEndpoint}/${id}`, data),
  detectInspection: () =>
    http.get<string | null>(`${inventoryEndpoint}/detect-inspection`),
};
