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
  categoryName: z.optional(z.string()),
  imageUrls: z.optional(z.array(z.string())),
  isUsedCategoryPrice: z.optional(z.boolean()),
});

export type ProductCreate = z.TypeOf<typeof ProductBody> & {
  inventoryId: string;
};
export type ProductType = Omit<ProductCreate, "imageUrls"> & {
  id: number;
  byDateId: string;
  categoryName: string;
  mainImage: string;
};

export type ProductDetail = {
  id: number;
  byDateId: string;
  categoryName: string;
} & ProductCreate;

export type ProductBarCode = {
  id: string;
  price: number;
};

export type ProductUpdate = Partial<ProductCreate>;
