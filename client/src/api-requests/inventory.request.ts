import { InventorySubmit, InventoryType } from "@/schemas/inventory.schema";
import http from "@/lib/http";

export const inventoryEndpoint = "/api/inventory";
export const inventoryRequest = {
  getALL: async () => {
    const response = await http.get<InventoryType[]>(inventoryEndpoint);
    return response.data;
  },
  create: (data: InventorySubmit) =>
    http.post<InventoryType>(inventoryEndpoint, data),
  update: (id: string, data: Partial<InventorySubmit>) =>
    http.patch<InventoryType>(`${inventoryEndpoint}/${id}`, data),
};
