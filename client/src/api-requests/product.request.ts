import http from "@/lib/http";
import { ProductCreate, ProductType } from "@/schemas/product.schema";

const productEndpoint = "/api/products";
export const productRequest = {
  getALL: async () => {
    const response = await http.get<ProductType[]>(productEndpoint);
    return response.data;
  },
  create: (data: ProductCreate) =>
    http.post<ProductType>(productEndpoint, data),
  update: (id: string, data: Partial<ProductType>) =>
    http.patch<ProductType>(`${productEndpoint}/${id}`, data),
};
