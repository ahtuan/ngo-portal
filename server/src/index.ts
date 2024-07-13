import { cors, HTTPMethod } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { Logestic } from "logestic";
import { authController } from "@/controllers/auth.controller";
import { mapResponseMiddleware } from "@/middlewares/map-response.middleware";
import jwt from "@elysiajs/jwt";
import { categoryController } from "@/controllers/category.controller";
import { inventoryController } from "@/controllers/inventory.controller";
import { productController } from "@/controllers/product.controller";
import { invoiceController } from "@/controllers/invoice.controller";
import { saleController } from "@/controllers/sale.controller";

const corsConfig = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"] as HTTPMethod[],
  allowedHeaders: "*",
  exposedHeaders: "*",
  maxAge: 5,
  credentials: true,
};
const apiName = process.env.API_NAME || "Ngõ Portal";
const swaggerConfig = {
  documentation: {
    info: {
      title: apiName,
      description: `API documentation for ${apiName}`,
      version: "1.0.0",
    },
  },
};
process.env.TZ = "Asia/Jakarta";
const app = new Elysia({ prefix: "/api" })
  .mapResponse(mapResponseMiddleware)
  .use(Logestic.preset("common"))
  .use(swagger(swaggerConfig))
  .use(cors(corsConfig))
  .use(
    jwt({
      name: "NgoPortal_JWT",
      secret: process.env.JWT_SECRET || "default",
    }),
  )
  .use(authController)
  .use(categoryController)
  .use(inventoryController)
  .use(productController)
  .use(invoiceController)
  .use(saleController)
  .listen(process.env.API_PORT || 3001);

// Expose methods
export const GET = app.handle;
export const POST = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const PUT = app.handle;

export type API = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} on ${new Date()}`,
);
