declare namespace Product {
  type Response = {
    id: number;
    byDateId: string;
    name: string;
    description: string | null;
    price: number | null;
    weight: number;
    mainImage: string | null;
    inventoryId: string;
    categoryUuid: string | null;
    categoryName: string | null;
    categoryUuidByKg: string | null;
    categoryNameByKg: string | null;
    status: string;
    isUsedCategoryPrice: boolean | null;
    isSold: boolean | null;
    unit: string | null;
  };

  type Detail = {
    imageUrls: string[];
  } & Omit<Response, "mainImage" | "unit">;

  type ByIdBody = {
    id: string;
  };

  type CreateBody = {
    name: string;
    inventoryId: string;
    description?: string;
    price: number | null;
    weight: number;
    imageUrls?: string[];
    categoryUuid: string;
    categoryName?: string;
    categoryUuidByKg?: string;
    isUsedCategoryPrice: boolean;
    status: string;
  };

  type InsertCreateTable = {
    byDateId: string;
    categoryId: number | null;
    categoryIdByKg?: number | null;
    categoryName?: string;
    weight: string;
    imageUrls: string;
  } & Omit<CreateBody, "categoryUuid" | "weight" | "imageUrls">;

  type UpdateBody = {
    name: string;
    description: string;
    price: number | null;
    weight: number;
    imageUrls: string[];
    categoryUuid: string;
    categoryUuidByKg?: string;
    categoryName: string;
    isUsedCategoryPrice: boolean;
    status: string;
  };

  type Filter = Partial<{
    page: string;
    category: string;
    keyword: string;
    status: string;
    size: string;
  }>;

  type Print = {
    byDateId: string;
    width: number;
    height: number;
    price?: string;
  };
}
