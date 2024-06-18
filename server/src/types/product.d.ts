declare namespace Product {
  type Response = {
    id: string;
    name: string;
    description: string;
    price: number;
    weight: number;
    imageUrl: string;
    isSold: boolean;
    inventoryId: number;
    categoryId: number;
  };

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
    isUsedCategoryPrice: boolean;
    status: string;
  };

  type InsertCreateTable = {
    byDateId: string;
    categoryId: number;
    categoryName: string;
    weight: string;
    imageUrls: string;
  } & Omit<CreateBody, "categoryUuid" | "weight" | "imageUrls">;

  type UpdateBody = {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId?: number;
  };
}
