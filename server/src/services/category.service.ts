import { DEFAULT_PAGING } from "@/constants/common";
import db from "@/db";
import { ApiResponse } from "@/libs/api-response";
import { NotFoundError } from "@/libs/error";
import { eq } from "drizzle-orm";
import { categories } from "@/db/schemas/category.schema";

class CategoryService {
  async getAll(query: Common.PagingQuery) {
    const limit = query.size || DEFAULT_PAGING.size;
    const offset = query.page || DEFAULT_PAGING.page;
    const data = await db.query.categories.findMany({
      limit,
      offset,
      orderBy: (categories, { asc }) => asc(categories.createdAt),
    });
    return ApiResponse.success(data);
  }
  async getById(id: string) {
    const data = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.uuid, id),
    });
    if (!data) {
      return new NotFoundError("Không tìm thấy dữ liệu");
    }
    return ApiResponse.success(data);
  }
  async create(body: Category.UpdateBody) {
    const insertedData = await db.insert(categories).values(body).returning();
    return ApiResponse.success(insertedData[0], "Tạo dữ liệu thành công", 201);
  }
  async update(id: string, body: Partial<Category.UpdateBody>) {
    const response = await this.getById(id);
    if (!response.data) {
      return response;
    }
    const updatedData = await db.update(categories).set(body).returning();
    return ApiResponse.success(updatedData, "Chỉnh sửa dữ liệu thành công");
  }
  async delete(id: string) {
    const response = await this.getById(id);
    if (!response.data) {
      return response;
    }
    await db.delete(categories).where(eq(categories.uuid, id));

    return ApiResponse.success(true, "Xoá dữ liệu thành công");
  }
}

export default CategoryService;
