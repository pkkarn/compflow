import { execSync } from "child_process";

export default async function globalSetup() {
  // 1. Force the database URL to point to a temporary test database file
  process.env.DATABASE_URL = "file:./test.db";
  process.env.PRISMA_NO_DOTENV = "1";

  // 2. Automatically sync the schema exactly ONCE globally before any tests run
  try {
    console.log("\n🔄 [Jest Global Setup] Syncing SQLite test database schema (test.db)...");
    execSync("npx prisma db push --skip-generate", {
      stdio: "inherit",
      env: {
        ...process.env,
        PRISMA_NO_DOTENV: "1",
        DATABASE_URL: "file:./test.db",
      },
    });
    console.log("✅ [Jest Global Setup] Test database synced successfully.\n");
  } catch (error) {
    console.error("❌ [Jest Global Setup] Failed to sync test database schema:", error);
    process.exit(1);
  }
}
