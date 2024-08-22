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
    unit: string | null;
    quantity: number;
    soldOut: number;
    cost: number;
  };

  type Sale = {
    uuid: string;
    name: string | null;
    description?: string | null;
    steps: string | null;
    condition: string | null;
    price: number | null;
  };
  type Detail = {
    imageUrls: string[];
    sale?: Sale;
    pricePerKg: number | null;
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
    quantity: number;
    status: string;
  };

  type InsertCreateTable = {
    byDateId: string;
    categoryId: number | null;
    categoryIdByKg?: number | null;
    categoryName?: string;
    weight: string;
    imageUrls: string;
    material: string;
    cost: number;
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
    quantity: number;
  };
}
