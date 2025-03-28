import "dotenv/config";
import type { Config } from "drizzle-kit";
import * as schema from "./src/db/schema/schema";
import { defineConfig } from "drizzle-kit";

console.log("📦 drizzle.config.ts loaded");
console.log("📦 DATABASE_URL =", process.env.DATABASE_URL);
console.log("📦 schema loaded:", Object.keys(schema));

export default defineConfig({
  schema: "./src/db/schema",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
