import { z } from "zod";
import { price, weight } from "@/schemas/common.schema";

export const InventoryBody = z.object({
  price: price,
  grossWeight: weight,
  status: z.string(),
  source: z
    .string()
    .trim()
    .min(1, "Lô hàng phải có nguồn" + " gốc"),
  unit: z.string(),
});

export type InventoryCreate = z.TypeOf<typeof InventoryBody>;
export type InventorySubmit = {
  grossWeight: string;
} & Omit<InventoryCreate, "grossWeight">;
export type InventoryType = {
  id: string;
  uuid: string;
  actualWeight: number;
} & InventoryCreate;
