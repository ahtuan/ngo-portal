import { z } from "zod";
import { weight } from "@/schemas/common.schema";

export const ProductBody = z.object({
  price: z.coerce.number({
    message: "Sản phẩm phải có đơn giá",
  }),
  weight: weight,
  name: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm"),
  description: z.optional(z.string()),
  status: z.string(),
  categoryUuid: z.string(),
  imageUrls: z.optional(z.array(z.string())),
  isUsedCategoryPrice: z.optional(z.boolean()),
});

export type ProductCreate = z.TypeOf<typeof ProductBody> & {
  inventoryId: string;
};
export type ProductType = ProductCreate & {
  id: number;
  byDateId: string;
  categoryName: string;
};

export type ProductBarCode = {
  id: string;
  price: number;
};
