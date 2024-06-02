import { defineConfig } from "drizzle-kit";
// @ts-ignore
export default defineConfig({
    dbCredentials: {
        url: process.env["DATABASE_URL"],
    }, // "mysql" | "sqlite" | "postgresql"
    dialect: "postgresql",
    out: "./drizzle",
    schema: "./src/db/schemas/*"
});