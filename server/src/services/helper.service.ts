import * as process from "node:process";
import { ApiResponse } from "@/libs/api-response";
import { mkdir } from "node:fs/promises";
import { unlinkSync } from "node:fs";
import * as url from "node:url";
import { PgSelect } from "drizzle-orm/pg-core";
import { DEFAULT_PAGING } from "@/constants/common";
import db from "@/db";
import { sql, WithSubquery } from "drizzle-orm";

class HelperService {
  /**
   * Save image to location
   * @param data Data must be base64 string or array of base64 string
   */
  async saveImages(data?: string | Array<string>) {
    if (!data) {
      return [""];
    }
    if (typeof data === "string") {
      return [await this.saveImage(data)];
    }
    return (
      await Promise.all(data.map((base64) => this.saveImage(base64)))
    ).filter(Boolean);
  }

  async readImages(urls: string, takeOne: boolean = false) {
    const paths = urls.split(";");
    if (takeOne) {
      return [await this.readImage(paths[0])];
    }
    return await Promise.all(paths.map((url) => this.readImage(url)));
  }

  deleteImages(urls: string[]) {
    try {
      urls.forEach((url) => url && unlinkSync(url));
    } catch (error) {
      console.error("Can not delete images from the server with url: ", url);
    }
    return;
  }

  withPagination<T extends PgSelect>(
    qb: T,
    offset: number = DEFAULT_PAGING.page,
    limit: number = DEFAULT_PAGING.size,
  ) {
    return qb.limit(limit).offset(offset * limit);
  }

  async getDataPagination<K>(
    wt: WithSubquery,
    offset: number = DEFAULT_PAGING.page,
    limit: number = DEFAULT_PAGING.size,
  ) {
    const select = db.with(wt).select().from(wt);
    const data = await this.withPagination(select.$dynamic(), offset, limit);

    const totalRecord = (
      await db
        .with(wt)
        .select({
          count: sql`count('*')`.mapWith(Number),
        })
        .from(wt)
    )[0].count;
    const totalPage = Math.ceil(totalRecord / limit);

    const response: Common.Paging<K> = {
      page: offset + 1,
      totalPage: totalPage,
      totalRecord: totalRecord,
      size: limit,
      // @ts-ignore
      data,
    };
    return response;
  }

  private getUploadPath = () => {
    const path = process.env.IMAGES_LOCATION;
    if (!path) {
      throw ApiResponse.error(
        "Server not have configuration for image location",
      );
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return [path, year, month, day].join("/");
  };

  private async saveImage(base64: string) {
    const uploadPath = this.getUploadPath();
    // Tạo thư mục nếu chưa tồn tại
    await mkdir(uploadPath, { recursive: true });

    // Tách data và meta data từ base64 string
    const [metaData, base64Image] = base64.split(";base64,");
    const extension = metaData.split("/").pop(); // Lấy phần mở rộng file từ meta data

    // Tạo tên file duy nhất (ví dụ sử dụng UUID)
    const fileName = `${new Date().getTime()}.${extension}`;

    // Decode base64 string thành Uint8Array
    const imageData = Uint8Array.from(atob(base64Image), (c) =>
      c.charCodeAt(0),
    );
    const filePath = `${uploadPath}/${fileName}`;
    // Ghi dữ liệu vào file
    await Bun.write(filePath, imageData);

    return filePath;
  }

  private async readImage(url: string) {
    if (!url) {
      return "";
    }
    try {
      const file = Bun.file(url);
      const byteArray = await file.arrayBuffer();
      const starter = `data:${file.type};base64,`;
      return (
        starter +
        btoa(
          new Uint8Array(byteArray).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, ""),
        )
      );
    } catch (error) {
      console.error("Error during read image", error);
    }
    return "";
  }
}

export const helperService = new HelperService();
