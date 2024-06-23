declare namespace Product {
  type Response = {
    id: number;
    byDateId: string;
    name: string;
    description: string | null;
    price: number;
    weight: number;
    mainImage: string | null;
    inventoryId: string;
    categoryUuid: string | null;
    categoryName: string | null;
    status: string;
    isUsedCategoryPrice: boolean | null;
    isSold: boolean | null;
  };

  type Detail = {
    imageUrls: string[];
  } & Omit<Response, "mainImage">;

  type ByIdBody = {
    id: string;
  };

  type CreateBody = {
    name: string;
    inventoryId: string;
    description?: string;
    price: number;
    weight: number;
    imageUrls?: string[];
    categoryUuid: string;
    categoryName?: string;
    isUsedCategoryPrice: boolean;
    status: string;
  };

  type InsertCreateTable = {
    byDateId: string;
    categoryId: number;
    categoryName?: string;
    weight: string;
    imageUrls: string;
  } & Omit<CreateBody, "categoryUuid" | "weight" | "imageUrls">;

  type UpdateBody = {
    name: string;
    description: string;
    price: number;
    weight: number;
    imageUrls: string[];
    categoryUuid: string;
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
}
