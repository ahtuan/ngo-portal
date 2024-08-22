import db from "@/db";
import { ApiResponse } from "@/libs/api-response";
import { DEFAULT_PAGING, INVENTORY_ENUM } from "@/constants/common";
import { NotFoundError } from "@/libs/error";
import {
  inventories,
  InventoryCreateType,
  InventoryResponse,
  InventoryType,
  InventoryUpdateType,
} from "@/db/schemas/inventory.schema";
import { eq, sql, sum } from "drizzle-orm";
import ProductService from "@/services/product.service";
import { products } from "@/db/schemas/product.schema";
import { byKgCategories } from "@/db/schemas/category.schema";
import { fixed } from "@/libs/helpers";

class InventoryService {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async getAll(query: Common.PagingQuery) {
    const limit = query.size ? +query.size : DEFAULT_PAGING.size;
    const offset = query.page ? +query.page - 1 : DEFAULT_PAGING.page;
    const data: InventoryType[] = await db.query.inventories.findMany({
      limit,
      offset,
      orderBy: (inventories, { asc }) => asc(inventories.createdAt),
    });
    return ApiResponse.success(data);
  }

  // async getRecent() {
  //   const result = await db
  //     .select({
  //       inventoryId: inventory.id,
  //       totalWeight: sql<number>`SUM(${products.weight})`, // Calculate sum
  // of weights }) .from(inventory) .innerJoin(products, eq(inventory.id,
  // products.inventoryId)) // Join tables .where(eq(products.sold, false))  //
  // Filter for unsold products .groupBy(inventory.id) // Group by inventory ID
  // .orderBy(sql`SUM(${products.weight}) DESC`) // Order by total weight
  // descending .limit(5); // Limit to top 5  return result; }

  async getById(uuid: string) {
    const data = await db.query.inventories.findFirst({
      where: (inventories, { eq }) =>
        eq(uuid.length > 10 ? inventories.uuid : inventories.id, uuid),
    });
    if (!data) {
      return new NotFoundError("Không tìm thấy dữ liệu");
    }
    return ApiResponse.success<InventoryResponse.RawSelect>(data);
  }

  async detectInspection() {
    const data = await db.query.inventories.findFirst({
      where: (inventories, { eq }) =>
        eq(inventories.status, INVENTORY_ENUM.INSPECTION),
    });

    if (!data) {
      return ApiResponse.success(null);
    }
    return ApiResponse.success(data.id);
  }

  async report(id: string) {
    const inventory = await this.getById(id);
    if (inventory.data) {
      const sq = db.$with("sq").as(
        db
          .select({
            id: products.id,
            byDateId: products.byDateId,
            weight: products.weight,
            quantity: products.quantity,
            categoryId: products.categoryId,
            categoryName: products.categoryName,
            categoryByKgName: byKgCategories.name,
            categoryIdByKg: products.categoryIdByKg,
          })
          .from(products)
          .leftJoin(
            byKgCategories,
            eq(products.categoryIdByKg, byKgCategories.id),
          )
          .where(eq(products.inventoryId, inventory.data.id)),
      );

      const calculatedSelect = {
        quantity: sum(products.quantity).mapWith(Number),
        weight: sum(products.weight).mapWith(Number),
      };
      const data = await db.with(sq).select(calculatedSelect).from(sq);

      const groupByCategory = await db
        .with(sq)
        .select({
          ...calculatedSelect,
          categoryName: sq.categoryName,
          categoryId: sq.categoryId,
          productIds: sql`STRING_AGG(CAST(${sq.id} AS text), ',')`,
        })
        .from(sq)
        .groupBy(sq.categoryName, sq.categoryId);

      const response = {
        ...data[0],
        groupByCategory,
      };

      return ApiResponse.success(response);
    }
    return ApiResponse.error("Không có thông tin lô hàng trùng khớp");
  }

  async create(body: InventoryCreateType) {
    const id = await this.getIdSequence();
    const pricePerKg = fixed(body.price / +body.actualWeight);
    const insertedData = await db
      .insert(inventories)
      .values({
        ...body,
        pricePerKg,
        id,
      })
      .returning();
    return ApiResponse.success(insertedData[0], "Tạo thành công lô hàng", 201);
  }

  async update(uuid: string, body: InventoryUpdateType) {
    const response = await this.getById(uuid);
    if (!response.data) {
      return response;
    }

    if (body.price || body.actualWeight) {
      body.pricePerKg = fixed(
        (body.price || response.data.price) /
          +(body.actualWeight || response.data.actualWeight),
      );

      await db.execute(sql`
        UPDATE raw.products p 
        SET 
            cost = p.weight * ${body.pricePerKg}
        WHERE 
            inventory_id = '${response.data.inventoryId}'
      `);
    }
    const updatedData = await db
      .update(inventories)
      .set(body)
      .where(eq(inventories.id, response.data.id))
      .returning();
    return ApiResponse.success(updatedData[0], "Chỉnh sửa dữ liệu thành công");
  }

  async delete(id: string) {
    const response = await this.getById(id);
    if (!response.data) {
      return response;
    }
    await db.delete(inventories).where(eq(inventories.uuid, id));
    return ApiResponse.success(true, "Xoá dữ liệu thành công");
  }

  private async getIdSequence() {
    const todayString = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD format
    const lasted = await db.query.inventories.findFirst({
      where: (record, { like }) => like(record.id, `${todayString}%`),
      orderBy: (record, { desc }) => [desc(record.createdAt)],
    });

    let sequence = 1;
    if (lasted) {
      sequence = +lasted.id.slice(8, 10) + 1;
    }
    return `${todayString}${sequence.toString().padStart(2, "0")}`;
  }
}

export default InventoryService;
