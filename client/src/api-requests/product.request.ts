import http from "@/lib/http";
import {
  ProductCreate,
  ProductDetail,
  ProductType,
} from "@/schemas/product.schema";

const productEndpoint = "/api/product";
export const productRequest = {
  getALL: async (queryString: string) => {
    const response = await http.get<Common.Paging<ProductType>>(
      productEndpoint + `?${queryString}`,
    );
    return response.data;
  },
  getDetail: async (byDateId: string) => {
    const response = await http.get<ProductDetail>(
      productEndpoint + "/" + byDateId,
    );
    return response.data;
  },
  create: (data: ProductCreate) =>
    http.post<ProductType>(productEndpoint, data),
  update: (id: string, data: Partial<ProductType>) =>
    http.patch<ProductType>(`${productEndpoint}/${id}`, data),
};
