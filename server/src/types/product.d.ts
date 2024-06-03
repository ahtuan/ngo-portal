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

  type UpdateBody = {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId?: number;
  };
}
