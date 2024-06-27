import http from "@/lib/http";
import { CategoryType } from "@/schemas/category.schema";

export const categoryEndpoint = "/api/category";
export const categoryRequest = {
  // TODO Optimise caching
  getAll: async () => {
    const response = await http.get<CategoryType[]>(categoryEndpoint);
    return response.data;
  },
  getAllOptions: async (unit: string = "PCS") => {
    const response = await http.get<Common.Option[]>(
      `${categoryEndpoint}/options/${unit}`,
    );
    return response.data;
  },
  upsert: (data: CategoryType) =>
    http.post<CategoryType>(categoryEndpoint, data),
  delete: (id: string) =>
    http.delete<CategoryType>(`${categoryEndpoint}/${id}`),
};

/**
 * Options for SWR Mutate when delete category
 * @param categories Category array after filter to deleted category
 */
export const categoryMutateOptions = (categories: CategoryType[]) => ({
  optimisticData: categories,
  rollbackOnError: true,
  populateCache: true,
  revalidate: false,
});
