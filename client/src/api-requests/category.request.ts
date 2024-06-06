import http from "@/lib/http";
import { CategoryType } from "@/schemas/category.schema";

export const categoryRequest = {
  // TODO Optimise caching
  getAll: () =>
    http.get<CategoryType[]>("/api/category", {
      cache: "no-store",
    }),
  create: (data: CategoryType) =>
    http.post<CategoryType>("/api/category", data),
  delete: (id: string) => http.delete<CategoryType>(`/api/category/${id}`),
};
