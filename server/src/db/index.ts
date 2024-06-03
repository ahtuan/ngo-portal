import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import schemas from "@/db/schemas";

config({ path: ".env" });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();
const db = drizzle(client, {
  schema: schemas,
});

export default db;
