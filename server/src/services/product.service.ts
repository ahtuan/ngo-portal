import {
  DEFAULT_PAGING,
  PRODUCT_STATUS_ENUM,
  UNIT_ENUM,
} from "@/constants/common";
import db from "@/db";
import { ApiResponse } from "@/libs/api-response";
import { NotFoundError } from "@/libs/error";
import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { products } from "@/db/schemas/product.schema";
import { helperService } from "@/services/helper.service";
import { byKgCategories, categories } from "@/db/schemas/category.schema";
import { getCurrentDate } from "@/libs/date";
import * as process from "node:process";
import { defaultValue } from "@/libs/helpers";
import SaleService from "@/services/sale.service";
import { SaleDB } from "@/db/schemas/sale.schema";
import { Parser } from "expr-eval";

const baseSelect = {
  id: products.id,
  byDateId: products.byDateId,
  name: products.name,
  description: products.description,
  price: products.price,
  categoryPrice: categories.price,
  byKgCategoryPrice: byKgCategories.price,
  weight: products.weight,
  inventoryId: products.inventoryId,
  categoryUuid: categories.uuid,
  categoryUuidByKg: byKgCategories.uuid,
  categoryName: products.categoryName,
  categoryNameByKg: byKgCategories.name,
  status: products.status,
  isUsedCategoryPrice: products.isUsedCategoryPrice,
  imageUrls: products.imageUrls,
  quantity: products.quantity,
  soldOut: products.soldOut,
};

class ProductService {
  private saleService: SaleService;

  constructor() {
    this.saleService = new SaleService();
  }

  async getAll(query: Product.Filter) {
    const limit = query.size ? +query.size : DEFAULT_PAGING.size;
    const offset = query.page ? +query.page - 1 : DEFAULT_PAGING.page;

    const uuidCollection = (query.category?.split(";") || [])
      .map((category) => `'${category}'`)
      .join(",");
    const statusCollection = (query.status?.split(";") || [])
      .map((category) => `'${category}'`)
      .join(",");

    const sq = db.$with("sq").as(
      db
        .select(baseSelect)
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(
          byKgCategories,
          eq(products.categoryIdByKg, byKgCategories.id),
        )
        .where(
          and(
            query.keyword
              ? or(
                  like(products.byDateId, `%${query.keyword}%`),
                  sql`unaccent(${products.name}) ilike unaccent(${sql.raw(`'%${query.keyword}%'`)})`,
                )
              : undefined,
            query.category
              ? sql`${categories.uuid} in ${sql.raw(`(${uuidCollection})`)} or ${byKgCategories.uuid} in ${sql.raw(`(${uuidCollection})`)}`
              : undefined,
            query.status
              ? sql`${products.status} in ${sql.raw(`(${statusCollection})`)}`
              : undefined,
          ),
        )
        .orderBy(asc(products.status), desc(products.updatedAt)),
    );

    const data = await db
      .with(sq)
      .select()
      .from(sq)
      .limit(limit)
      .offset(offset * limit);

    const totalRecord = (
      await db
        .with(sq)
        .select({
          count: sql`count('*')`.mapWith(Number),
        })
        .from(sq)
    )[0].count;
    const totalPage = Math.ceil(totalRecord / limit);
    const mapped: Product.Response[] = await Promise.all(
      data.map(async (product) => ({
        id: product.id,
        byDateId: product.byDateId,
        name: product.name,
        description: product.description,
        price: product.isUsedCategoryPrice
          ? product.byKgCategoryPrice
            ? product.byKgCategoryPrice
            : product.categoryPrice
          : product.price,
        weight: +(product.weight as string),
        inventoryId: product.inventoryId,
        categoryUuid: product.categoryUuid,
        categoryName: product.categoryName,
        categoryUuidByKg: defaultValue(product.categoryUuidByKg) as string,
        categoryNameByKg: defaultValue(product.categoryNameByKg) as string,
        status: product.status,
        isUsedCategoryPrice: product.isUsedCategoryPrice,
        quantity: product.quantity,
        soldOut: product.soldOut,
        mainImage: (
          await helperService.readImages(product.imageUrls ?? "", true)
        )[0],
        unit: product.categoryUuidByKg ? UNIT_ENUM.KG : UNIT_ENUM.PCS,
      })),
    );

    const response: Common.Paging<Product.Response> = {
      page: offset + 1,
      totalPage: totalPage,
      totalRecord: totalRecord,
      size: limit,
      data: mapped,
    };
    return ApiResponse.success(response);
  }

  async getDetail(byDateId: string) {
    const result = await db
      .select({ ...baseSelect, categoryIdByKg: byKgCategories.id })
      .from(products)
      .where(eq(products.byDateId, byDateId))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(byKgCategories, eq(products.categoryIdByKg, byKgCategories.id));
    const rawData = result[0];
    if (!rawData) {
      return new NotFoundError("Không tìm thấy mã sản phẩm: " + byDateId);
    }

    const price = rawData.isUsedCategoryPrice
      ? rawData.byKgCategoryPrice
        ? rawData.byKgCategoryPrice
        : rawData.categoryPrice
      : rawData.price;
    const mappedData: Product.Detail = {
      ...rawData,
      categoryUuidByKg: defaultValue(rawData.categoryUuidByKg) as string,
      categoryNameByKg: defaultValue(rawData.categoryNameByKg) as string,
      price,
      weight: +rawData.weight,
      imageUrls: (
        await helperService.readImages(rawData.imageUrls ?? "")
      ).filter(Boolean),
      sale: await this.getSaleForProduct(rawData.categoryIdByKg, price),
    };

    return ApiResponse.success(mappedData);
  }

  async printBarcode(body: Product.Print) {
    try {
      const url = process.env.PRINT_URL || "https://localhost:5001/print";
      const response = await fetch(url, {
        tls: {
          rejectUnauthorized: false,
        },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const res = await response.json();
      if (res.status === 200 || res === true) {
        return ApiResponse.success(true);
      }
      throw "Request failed";
    } catch (error) {
      return ApiResponse.error("Không thể in");
    }
  }

  async create(body: Product.CreateBody) {
    const { inventoryId, categoryUuid, categoryUuidByKg } = body;
    // Check ID of Inventory
    const inventory = await db.query.inventories.findFirst({
      where: (inventories, { eq }) => eq(inventories.id, inventoryId),
    });

    if (!inventory) {
      return new NotFoundError(
        `Không tìm thấy thông tin lô hàng ${inventoryId}`,
      );
    }

    // Create ID for Product
    const byDateId = await this.getIdSequence();
    const categoryRef: {
      categoryId: number | null;
      categoryIdByKg?: number | null;
      categoryName?: string;
    } = {
      categoryId: null,
      categoryIdByKg: null,
      categoryName: body.categoryName,
    };
    let price = body.price;
    if (categoryUuid) {
      const category = await db.query.categories.findFirst({
        where: (category, { eq }) => eq(category.uuid, categoryUuid),
      });

      if (category) {
        categoryRef.categoryName = category.name;
        categoryRef.categoryId = category.id;

        if (body.isUsedCategoryPrice) {
          body.price = null; // Do not set the price when use category price,
          // set price back to 0
          price = category.price;
          if (categoryUuidByKg) {
            const categoryByKg = await db.query.byKgCategories.findFirst({
              where: (category, { eq }) => eq(category.uuid, categoryUuidByKg),
            });
            if (categoryByKg) {
              categoryRef.categoryIdByKg = categoryByKg.id;
              price = categoryByKg.price;
            }
          }
        }
      } else {
        // If can not find category and isUsedCategoryPrice equal true, It's
        // not make sense, must be set to be false
        body.isUsedCategoryPrice = false;
        categoryRef.categoryName = undefined;
      }
    }
    // TODO Store images and get URL
    const imgUrls = await helperService.saveImages(body.imageUrls);
    const payload: Product.InsertCreateTable = {
      ...body,
      ...categoryRef,
      byDateId,
      weight: body.weight.toString(),
      imageUrls: imgUrls.join(";"),
    };

    // Insert into database
    const insertedData = await db.insert(products).values(payload).returning();
    insertedData[0].price = price;
    return ApiResponse.success(insertedData[0], "Tạo dữ liệu thành công", 201);
  }

  async update(id: string, body: Partial<Product.UpdateBody>) {
    const response = await this.getById(id);
    if (!response) {
      return response;
    }
    const { categoryUuid, categoryUuidByKg } = body;
    let modifiedData: {
      categoryId?: number | null;
      categoryIdByKg?: number | null;
      imageUrls?: string;
    } = {};
    if (categoryUuid) {
      const category = await db.query.categories.findFirst({
        where: (category, { eq }) => eq(category.uuid, categoryUuid),
      });

      if (category) {
        body.categoryName = category.name;
        modifiedData.categoryId = category.id;
        if (body.isUsedCategoryPrice) {
          body.price = null; // Do not set the price when use category price,
          // set price back to 0
        }
      } else {
        // If can not find category and isUsedCategoryPrice equal true, It's
        // not make sense, must be set to be false
        body.isUsedCategoryPrice = false;
        body.categoryName = undefined;
      }
    } else if (categoryUuid === undefined) {
      delete modifiedData.categoryId;
    } else if (response.categoryId) {
      modifiedData.categoryId = null;
    }

    if (categoryUuidByKg) {
      const categoryByKg = await db.query.byKgCategories.findFirst({
        where: (category, { eq }) => eq(category.uuid, categoryUuidByKg),
      });
      if (categoryByKg) {
        modifiedData.categoryIdByKg = categoryByKg.id;
      }
    } else {
      delete modifiedData.categoryIdByKg;
    }

    if (body.imageUrls) {
      // Delete old image with url from Database
      helperService.deleteImages((response.imageUrls ?? "").split(";"));
      modifiedData.imageUrls = (
        await helperService.saveImages(body.imageUrls)
      ).join(";");
    }
    const updatedData = await db
      .update(products)
      .set({
        ...body,
        ...modifiedData,
        imageUrls: modifiedData.imageUrls,
        weight: body.weight?.toString(),
        updatedAt: getCurrentDate(),
      })
      .where(eq(products.id, response.id))
      .returning();

    return ApiResponse.success(updatedData, "Chỉnh sửa dữ liệu thành công");
  }

  async delete(byDateId: string) {
    const response = await this.getById(byDateId);
    if (!response) {
      return response;
    }
    await db.delete(products).where(eq(products.id, response.id));

    return ApiResponse.success(true, "Xoá dữ liệu thành công");
  }

  async getById(byDateId: string | number) {
    const data = await db.query.products.findFirst({
      where: (product, { eq }) =>
        eq(
          typeof byDateId === "string" ? product.byDateId : product.id,
          byDateId,
        ),
    });
    if (!data) {
      return undefined;
    }
    return data;
  }

  async updateAfterInvoice(id: number, quantity: number, soldOut: number) {
    const update: {
      soldOut: number;
      status?: string;
    } = {
      soldOut,
    };
    if (soldOut === quantity) {
      update.status = PRODUCT_STATUS_ENUM.SOLD;
    } else if (soldOut > quantity) {
      throw new Error(
        `Sản phẩm bán ra không được lớn hơn số lượng hiện có với id: ${id}, quantity: ${quantity}, soldOut: ${soldOut}`,
      );
    }

    await db
      .update(products)
      .set({
        ...update,
        updatedAt: getCurrentDate(),
      })
      .where(eq(products.id, id));
  }

  private async getIdSequence() {
    const todayString = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD format

    const lasted = await db.query.products.findFirst({
      where: (record, { like }) => like(record.byDateId, `${todayString}%`),
      orderBy: (record, { desc }) => [desc(record.createdAt)],
    });

    let sequence = 1;
    if (lasted) {
      sequence = +lasted.byDateId.slice(8, 12) + 1;
    }
    return `${todayString}${sequence.toString().padStart(4, "0")}`;
  }

  private async getSaleForProduct(
    categoryIdByKg: number | null,
    price: number | null,
  ): Promise<Product.Sale | undefined> {
    const validSales = await this.saleService.getValidSales();
    if (validSales.length > 0) {
      let sale: Product.Sale = {
        name: "",
        description: "",
        condition: "",
        steps: "",
        uuid: "",
        price: null,
      };
      let pickSale: SaleDB.RawSale | undefined;
      if (!categoryIdByKg) {
        const availableSales = validSales.filter((s) => !s.useForKgCateIds);
        if (availableSales.length > 0) {
          pickSale = availableSales[0];
        }
      } else {
        const availableSales = validSales.filter((s) =>
          s.useForKgCateIds?.split(";")?.includes(categoryIdByKg.toString()),
        );
        if (availableSales.length > 0) {
          pickSale = availableSales[0];
          if (
            !(
              pickSale.condition?.includes("quantity") ||
              pickSale.steps?.includes("quantity")
            ) &&
            price
          ) {
            console.log("pickSale.steps", pickSale.steps);
            console.log("price", price);
            sale.price = Parser.evaluate(pickSale.steps, { price: price });
          }
        }
      }
      if (pickSale) {
        sale.name = pickSale.name;
        sale.uuid = pickSale.uuid;
        sale.description = pickSale.description;
        sale.steps = pickSale.steps;
        sale.condition = pickSale.condition;
      } else {
        return;
      }

      return sale;
    }
    return;
  }
}

export default ProductService;
