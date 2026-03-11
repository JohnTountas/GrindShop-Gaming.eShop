/**
 * Prisma CLI configuration that declares the schema location and datasource URL.
 */
import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Builds the Prisma config used by generate/migrate commands.
 */
const datasourceUrl =
  process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim() || "";

if (!datasourceUrl) {
  throw new Error(
    "DATABASE_URL or DIRECT_URL must be set for Prisma. Configure Fly secrets or a local .env."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: datasourceUrl,
  },
});
