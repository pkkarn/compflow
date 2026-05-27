import { seedDatabase } from "./seed";
import { prisma } from "./db";

async function main() {
  console.log("🌱 Starting development database seeding (dev.db)...");
  const startTime = Date.now();
  await seedDatabase();
  console.log(`✅ Database successfully seeded with 10,000 employees in ${Date.now() - startTime}ms!`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("❌ Seeding failed:", e);
  await prisma.$disconnect();
  process.exit(1);
});
