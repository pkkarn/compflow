import { prisma } from "../src/db";
import { seedDatabase } from "../src/seed";

describe("High-Performance Seeding Script TDD Test", () => {
  // Increase Jest timeout since we are testing a massive 10,000 record bulk operation
  jest.setTimeout(30000);

  beforeEach(async () => {
    // Completely wipe database before running the seed test to guarantee accurate counting
    await prisma.employee.deleteMany({});
    await prisma.country.deleteMany({});
    await prisma.jobTitle.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should seed exactly 10,000 employees in under 2 seconds", async () => {
    const startTime = Date.now();

    // 1. Run seed script
    await seedDatabase();

    const duration = Date.now() - startTime;
    console.log(`Seeding execution duration: ${duration}ms`);

    // 2. Assert exactly 10,000 employees were written
    const employeeCount = await prisma.employee.count();
    expect(employeeCount).toBe(10000);

    // 3. Assert countries and job titles were generated and linked
    const countryCount = await prisma.country.count();
    const jobTitleCount = await prisma.jobTitle.count();

    expect(countryCount).toBeGreaterThan(0);
    expect(jobTitleCount).toBeGreaterThan(0);

    // 4. Assert performance requirement (Strictly under 2000ms)
    expect(duration).toBeLessThan(2000);

    // 5. Verify data linkage integrity
    const sampleEmployee = await prisma.employee.findFirst({
      include: {
        country: true,
        jobTitle: true,
      },
    });

    expect(sampleEmployee).not.toBeNull();
    expect(sampleEmployee?.fullName).toBeDefined();
    expect(sampleEmployee?.email).toContain("@compflow.com");
    expect(sampleEmployee?.country.name).toBeDefined();
    expect(sampleEmployee?.jobTitle.title).toBeDefined();
  });
});
