import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: { unoptimized: true },
  // Loaded by Node's require rather than bundled: OpenTelemetry patches modules as require loads
  // them, so tedious (Prisma's SQL Server driver) has to stay a real module to be traced.
  serverExternalPackages: ["@prisma/adapter-mssql", "mssql", "tedious", "@opentelemetry/sdk-node", "@opentelemetry/instrumentation-tedious", "@opentelemetry/instrumentation-runtime-node"],
};

export default nextConfig;
