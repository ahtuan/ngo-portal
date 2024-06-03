declare namespace Category {
  type Body = {
    uuid: string;
    name: string;
    description: string;
    price: number;
  };

  type ByIdBody = {
    id: string;
  };

  type UpdateBody = {
    name: string;
    description?: string;
    price: number;
  };
}
