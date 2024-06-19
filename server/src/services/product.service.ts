import { DEFAULT_PAGING } from "@/constants/common";
import db from "@/db";
import { ApiResponse } from "@/libs/api-response";
import { NotFoundError } from "@/libs/error";
import { desc, eq, sql } from "drizzle-orm";
import { products } from "@/db/schemas/product.schema";
import { helperService } from "@/services/helper.service";
import { categories } from "@/db/schemas/category.schema";

class ProductService {
  async getAll(query: Product.Filter) {
    const limit = query.size ? +query.size : DEFAULT_PAGING.size;
    const offset = query.page ? +query.page - 1 : DEFAULT_PAGING.page;

    const sq = db.$with("sq").as(
      db
        .select({
          id: products.id,
          byDateId: products.byDateId,
          name: products.name,
          description: products.description,
          price: products.price,
          weight: products.weight,
          inventoryId: products.inventoryId,
          categoryUuid: categories.uuid,
          categoryName: products.categoryName,
          status: products.status,
          isUsedCategoryPrice: products.isUsedCategoryPrice,
          isSold: products.isSold,
          imageUrls: products.imageUrls,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .orderBy(desc(products.updatedAt)),
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
        price: product.price,
        weight: +(product.weight as string),
        inventoryId: product.inventoryId,
        categoryUuid: product.categoryUuid,
        categoryName: product.categoryName,
        status: product.status,
        isUsedCategoryPrice: product.isUsedCategoryPrice,
        isSold: product.isSold,
        mainImage: (
          await helperService.readImages(product.imageUrls ?? "", true)
        )[0],
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

  async getById(byDateId: string) {
    const data = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.byDateId, byDateId),
    });
    if (!data) {
      return new NotFoundError("Không tìm thấy dữ liệu");
    }
    return ApiResponse.success(data);
  }

  async create(body: Product.CreateBody) {
    const { inventoryId, categoryUuid } = body;
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
    let categoryId: number = 0;
    let categoryName: string = "";
    if (categoryUuid) {
      const category = await db.query.categories.findFirst({
        where: (category, { eq }) => eq(category.uuid, categoryUuid),
      });

      if (category) {
        categoryName = category.name;
        categoryId = category.id;
      } else {
        // If can not find category and isUsedCategoryPrice equal true, It's
        // not make sense, must be set to be false
        body.isUsedCategoryPrice = false;
      }
    }
    // TODO Store images and get URL
    const imgUrls = await helperService.saveImages(body.imageUrls);
    console.log("imgUrls", imgUrls);
    const payload: Product.InsertCreateTable = {
      ...body,
      byDateId,
      categoryId,
      categoryName,
      weight: body.weight.toString(),
      imageUrls: imgUrls.join(";"),
    };
    // Insert into database
    const insertedData = await db.insert(products).values(payload).returning();
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

  async delete(byDateId: string) {
    const response = await this.getById(byDateId);
    if (!response.data) {
      return response;
    }
    await db.delete(products).where(eq(products.id, response.data.id));

    return ApiResponse.success(true, "Xoá dữ liệu thành công");
  }

  private async getIdSequence() {
    const lasted = await db.query.products.findFirst({
      orderBy: (record, { desc }) => [desc(record.createdAt)],
    });
    const todayString = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD format
    let sequence = 1;
    if (lasted) {
      sequence = +lasted.byDateId.slice(8, 12) + 1;
    }
    return `${todayString}${sequence.toString().padStart(4, "0")}`;
  }
}

export default ProductService;
