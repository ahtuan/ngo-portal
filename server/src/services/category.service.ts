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

  async getById(uuid?: string) {
    if (!uuid) {
      return new NotFoundError("Không tìm thấy dữ liệu");
    }
    const data = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.uuid, uuid),
    });
    if (!data) {
      return new NotFoundError("Không tìm thấy dữ liệu");
    }
    return ApiResponse.success(data);
  }

  async upsert(body: Category.Body) {
    const result = await this.getById(body.uuid);
    if (!result.data) {
      // Create if not exist in database
      const insertedData = await db
        .insert(categories)
        .values({
          name: body.name,
          price: body.price,
        })
        .returning();
      return ApiResponse.success(
        insertedData[0],
        "Tạo dữ liệu thành công",
        201,
      );
    }
    const partialData: Partial<Category.Body> = body;

    delete partialData.uuid;
    const updatedData = await db
      .update(categories)
      .set({
        name: partialData.name,
        price: partialData.price,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, result.data.id))
      .returning();
    return ApiResponse.success(updatedData, "Chỉnh sửa dữ liệu thành công");
  }

  async delete(uuid: string) {
    const response = await this.getById(uuid);
    if (!response.data) {
      return response;
    }
    await db.delete(categories).where(eq(categories.uuid, uuid));

    return ApiResponse.success(true, "Xoá dữ liệu thành công");
  }
}

export default CategoryService;
