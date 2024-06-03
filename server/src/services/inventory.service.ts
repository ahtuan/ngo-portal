import db from "@/db";
import { ApiResponse } from "@/libs/api-response";
import { DEFAULT_PAGING, INVENTORY_ENUM } from "@/constants/common";
import { NotFoundError } from "@/libs/error";
import {
  inventories,
  inventoryDeliveries,
} from "@/db/schemas/inventory.schema";
import { eq } from "drizzle-orm";

class InventoryService {
  async getAll(query: Common.PagingQuery) {
    const limit = query.size || DEFAULT_PAGING.size;
    const offset = query.page || DEFAULT_PAGING.page;
    const data = await db.query.inventories.findMany({
      limit,
      offset,
      orderBy: (inventories, { asc }) => asc(inventories.createdAt),
    });
    return ApiResponse.success(data);
  }
  async getById(id: string) {
    const data = await db.query.inventories.findFirst({
      where: (inventories, { eq }) => eq(inventories.uuid, id),
    });
    if (!data) {
      return new NotFoundError("Không tìm thấy dữ liệu");
    }
    return ApiResponse.success(data);
  }
  async create(body: Inventory.UpdateBody) {
    const insertedData = await db.insert(inventories).values(body).returning();
    return ApiResponse.success(insertedData[0], "Tạo thành công lô hàng", 201);
  }
  async update(id: string, body: Partial<Inventory.UpdateBody>) {
    const response = await this.getById(id);
    if (!response.data) {
      return response;
    }
    const updatedData = await db.update(inventories).set(body).returning();
    return ApiResponse.success(updatedData, "Chỉnh sửa dữ liệu thành công");
  }
  async delete(id: string) {
    const response = await this.getById(id);
    if (!response.data) {
      return response;
    }
    await db.delete(inventories).where(eq(inventories.uuid, id));

    return ApiResponse.success(true, "Xoá dữ liệu thành công");
  }
  async createDelivery(id: string, body: Inventory.DeliveryRequest) {
    const response = await this.getById(id);
    if (!response.data) {
      return response;
    }
    const insertedData = await db
      .insert(inventoryDeliveries)
      .values({
        ...body,
        inventoryID: response.data.id,
      })
      .returning();

    return ApiResponse.success(
      insertedData[0],
      "Tạo thông tin vận chuyển thành công",
      201,
    );
  }
}

export default InventoryService;
