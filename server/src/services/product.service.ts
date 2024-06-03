import { DEFAULT_PAGING } from "@/constants/common";
import db from "@/db";
import { ApiResponse } from "@/libs/api-response";
import { NotFoundError } from "@/libs/error";
import { eq } from "drizzle-orm";
import { products } from "@/db/schemas/product.schema";

class ProductService {
  async getAll(query: Common.PagingQuery) {
    const limit = query.size || DEFAULT_PAGING.size;
    const offset = query.page || DEFAULT_PAGING.page;
    const data = await db.query.products.findMany({
      limit,
      offset,
      orderBy: (products, { asc }) => asc(products.createdAt),
    });
    return ApiResponse.success(data);
  }
  async getById(id: string) {
    const data = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.id, id),
    });
    if (!data) {
      return new NotFoundError("Không tìm thấy dữ liệu");
    }
    return ApiResponse.success(data);
  }
  async create(body: Product.UpdateBody) {
    // TODO Create ID for Product
    const id = "";
    const insertedData = await db
      .insert(products)
      .values({
        ...body,
        id,
      })
      .returning();
    return ApiResponse.success(insertedData[0], "Tạo dữ liệu thành công", 201);
  }
  async update(id: string, body: Partial<Product.UpdateBody>) {
    const response = await this.getById(id);
    if (!response.data) {
      return response;
    }
    const updatedData = await db.update(products).set(body).returning();
    return ApiResponse.success(updatedData, "Chỉnh sửa dữ liệu thành công");
  }
  async delete(id: string) {
    const response = await this.getById(id);
    if (!response.data) {
      return response;
    }
    await db.delete(products).where(eq(products.id, id));

    return ApiResponse.success(true, "Xoá dữ liệu thành công");
  }
}

export default ProductService;
