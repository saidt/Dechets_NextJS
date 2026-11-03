import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/schema/",
  //engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
