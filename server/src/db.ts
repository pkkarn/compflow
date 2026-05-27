import { PrismaClient } from "@prisma/client";

// Ensure a single global instance of PrismaClient is shared across our application.
// This prevents database connection leaks during hot-reloading in development.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
