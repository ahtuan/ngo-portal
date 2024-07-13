import { Sale } from "@/models/sale.model";
import db from "@/db";
import { SaleDB, sales } from "@/db/schemas/sale.schema";
import { ApiResponse } from "@/libs/api-response";
import { DEFAULT_PAGING } from "@/constants/common";
import { desc, eq } from "drizzle-orm";
import { helperService } from "@/services/helper.service";
import CategoryService from "@/services/category.service";
import { getCurrentDate } from "@/libs/date";

class SaleService {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async getAll(query: Common.PagingQuery) {
    const limit = query.size ? +query.size : DEFAULT_PAGING.size;
    const offset = query.page ? +query.page - 1 : DEFAULT_PAGING.page;

    const sq = db
      .$with("sq")
      .as(db.select().from(sales).orderBy(desc(sales.updatedAt)));
    const response = await helperService.getDataPagination<SaleDB.RawSale>(
      sq,
      offset,
      limit,
    );

    const listCategoryName = await this.categoryService.getKgWithId();
    const mapping = response.data.map((item) => {
      const category = item.useForKgCateIds?.split(";").map((id) => {
        const data = listCategoryName.find((cate) => cate.id === +id);
        return data;
      });
      const uuids = category?.map((i) => i?.uuid).filter(Boolean);
      const names = category?.map((i) => i?.name).join(" | ");
      return {
        uuid: item.uuid,
        name: item.name,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
        isActive: item.isActive,
        steps: item.steps,
        condition: item.condition,
        useForKgCateIds: uuids,
        categoriesName: names,
        isInvoiceOnly: item.isInvoiceOnly,
      } as SaleDB.Sale;
    });
    const result: Common.Paging<SaleDB.Sale> = {
      ...response,
      data: mapping,
    };
    return ApiResponse.success(result);
  }

  async create(body: Sale.Create) {
    try {
      let useForKgCateIds = (
        await body.useForKgCateIds?.reduce(
          async (prevPromise, uuid) => {
            const prev = await prevPromise;
            const category = await this.categoryService.getById(uuid, true);
            if (category) {
              prev.push(category.id);
            }
            return prev;
          },
          Promise.resolve([] as Array<number>),
        )
      )?.join(";");

      const response = (
        await db
          .insert(sales)
          .values({ ...body, useForKgCateIds })
          .returning()
      )[0];
      return ApiResponse.success(response);
    } catch (error) {
      console.error(error);
      return ApiResponse.error("Không thể tạo khuyến mãi mới");
    }
  }

  async update(uuid: string, body: SaleDB.Update) {
    try {
      const response = await db
        .update(sales)
        .set({ ...body, updatedAt: getCurrentDate(), updatedBy: "admin" })
        .where(eq(sales.uuid, uuid))
        .returning();
      return ApiResponse.success(response);
    } catch (error) {
      console.error(error);
      return ApiResponse.error("Không thể chỉnh sửa dữ liệu");
    }
  }

  async delete(uuid: string) {}

  async getValidSales() {
    return db.query.sales.findMany({
      where: (sale, { eq, lte, isNull }) =>
        eq(sale.isActive, true) &&
        (isNull(sale.endDate) || lte(sale.endDate, new Date())),
    });
  }

  async getById(id: string | number) {
    return db.query.sales.findFirst({
      where: (sale, { eq }) =>
        eq(typeof id !== "string" ? sale.id : sale.uuid, id),
    });
  }
}

export default SaleService;
