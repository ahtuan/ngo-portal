import { z } from "zod";
import { weight } from "@/schemas/common.schema"; // export const CollectionItem
// = z.object({

// export const CollectionItem = z.object({
//   status: z.string().min(1, "Vui lòng nhập tình trạng sản phẩm"),
//   quantity: z.number().min(1, "Phải có ít nhất một sản phẩm"),
// });
// export const ProductCollection = z.object({
//   isInCollection: z.optional(z.boolean()),
//   name: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm"),
//   items: z.array(CollectionItem),
// });

export const ProductBody = z
  .object({
    price: z.coerce.number({
      message: "Sản phẩm phải có đơn giá",
    }),
    weight: weight,
    name: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm"),
    description: z.optional(z.string()),
    status: z.string(),
    categoryUuid: z.string().min(1, "Hãy chọn phân loại sản phẩm"),
    categoryName: z.optional(z.string()),
    imageUrls: z.optional(z.array(z.string())),
    isUsedCategoryPrice: z.optional(z.boolean()),
    categoryUuidByKg: z.optional(z.string()),
    quantity: z.coerce.number().min(1, "Vui lòng nhập số lượng lớn hơn bằng 1"),
    // collection: z.optional(ProductCollection),
  })
  .refine(
    (schema) => {
      return !(schema.isUsedCategoryPrice && !schema.categoryUuidByKg);
    },
    {
      path: ["categoryUuidByKg"],
      message: "Hãy chọn giá theo kg",
    },
  );

export type ProductCreate = z.TypeOf<typeof ProductBody> & {
  inventoryId: string;
};
export type ProductType = Omit<ProductCreate, "imageUrls"> & {
  id: number;
  byDateId: string;
  categoryName: string;
  categoryNameByKg?: string;
  mainImage: string;
  unit: string;
  soldOut: number;
};

export type ProductDetail = {
  id: number;
  byDateId: string;
  categoryName: string;
  categoryNameByKg?: string;
  soldOut: number;
} & ProductCreate;

export type ProductBarCode = {
  id: string;
  price: number;
  quantity: number;
  isUsedCategoryPrice?: boolean;
};

export type ProductUpdate = Partial<ProductCreate>;

export type ProductPrint = {
  byDateId: string;
  width: number;
  height: number;
  price: string;
  quantity: number;
};
