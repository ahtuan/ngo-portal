import { UNIT_ENUM } from "@/constants/common";
import db from "@/db";
import { ApiResponse } from "@/libs/api-response";
import { desc, eq } from "drizzle-orm";
import {
  byKgCategories,
  categories,
  CategoryCreateType,
} from "@/db/schemas/category.schema";
import { getCurrentDate } from "@/libs/date";
import { unionAll } from "drizzle-orm/pg-core";

class CategoryService {
  async getAll(query: Common.PagingQuery) {
    const pcsData = db
      .select({
        uuid: categories.uuid,
        name: categories.name,
        price: categories.price,
        unit: categories.unit,
        updatedAt: categories.updatedAt,
      })
      .from(categories);
    const kgData = db
      .select({
        uuid: byKgCategories.uuid,
        name: byKgCategories.name,
        price: byKgCategories.price,
        unit: byKgCategories.unit,
        updatedAt: byKgCategories.updatedAt,
      })
      .from(byKgCategories);
    // @ts-ignore
    const data = await unionAll(pcsData, kgData).orderBy((category) =>
      desc(category.updatedAt),
    );

    return ApiResponse.success(data);
  }

  async getAllOptions(unit: string = UNIT_ENUM.PCS) {
    let data: Common.Option[] = [];
    if (unit === UNIT_ENUM.PCS || unit === UNIT_ENUM.KG) {
      const isKgTable = unit === UNIT_ENUM.KG;
      const table = isKgTable ? byKgCategories : categories;
      data = await db
        .select({
          label: table.name,
          value: table.uuid,
        })
        .from(table)
        .where(eq(table.unit, unit.toUpperCase()));
    } else {
      const pcsData = db
        .select({
          value: categories.uuid,
          label: categories.name,
        })
        .from(categories);
      const kgData = db
        .select({
          value: byKgCategories.uuid,
          label: byKgCategories.name,
        })
        .from(byKgCategories);
      // @ts-ignore
      data = await unionAll(pcsData, kgData);
    }

    return ApiResponse.success(data);
  }

  async upsert(body: CategoryCreateType) {
    const result = await this.getById(body.uuid, body.unit === UNIT_ENUM.KG);
    const isKgTable = body.name.toUpperCase().includes("(KG)");
    if (!result) {
      // Create if not exist in database
      const insertedData = await db
        .insert(isKgTable ? byKgCategories : categories)
        .values({
          name: body.name,
          price: body.price,
          unit: isKgTable ? UNIT_ENUM.KG : UNIT_ENUM.PCS,
        })
        .returning();
      return ApiResponse.success(
        insertedData[0],
        "Tạo dữ liệu thành công",
        201,
      );
    }
    const partialData: Partial<CategoryCreateType> = body;

    delete partialData.uuid;
    const updatedData = await db
      .update(isKgTable ? byKgCategories : categories)
      .set({
        name: partialData.name,
        price: partialData.price,
        unit: isKgTable ? UNIT_ENUM.KG : UNIT_ENUM.PCS,
        updatedAt: getCurrentDate(),
      })
      .where(eq(categories.id, result.id))
      .returning();
    return ApiResponse.success(updatedData[0], "Chỉnh sửa dữ liệu thành công");
  }

  async delete(uuid: string, unit?: string) {
    const isKgUuid = unit?.toUpperCase() === UNIT_ENUM.KG;
    const response = await this.getById(uuid, isKgUuid);
    if (!response) {
      return response;
    }
    await db
      .delete(isKgUuid ? byKgCategories : categories)
      .where(eq(isKgUuid ? byKgCategories.uuid : categories.uuid, uuid));

    return ApiResponse.success(true, "Xoá dữ liệu thành công");
  }

  private async getById(uuid?: string, isKGTable?: boolean) {
    if (!uuid || !isKGTable) {
      return undefined;
    }
    const data = await db
      .select()
      .from(isKGTable ? byKgCategories : categories)
      .where((category) => eq(category.uuid, uuid));

    if (!data) {
      return undefined;
    }
    return data[0];
  }
}

export default CategoryService;
