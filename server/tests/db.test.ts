import { prisma } from "../src/db";

describe("Database Connection Test", () => {
  // Before all tests, clear the test database entries to ensure a clean slate
  beforeAll(async () => {
    await prisma.employee.deleteMany({});
    await prisma.country.deleteMany({});
    await prisma.jobTitle.deleteMany({});
  });

  // After all tests, disconnect the database client
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should successfully insert and query a Country record", async () => {
    // 1. Create a country
    const newCountry = await prisma.country.create({
      data: {
        name: "India",
      },
    });

    expect(newCountry.id).toBeDefined();
    expect(newCountry.name).toBe("India");

    // 2. Query it back
    const fetchedCountry = await prisma.country.findUnique({
      where: { name: "India" },
    });

    expect(fetchedCountry).not.toBeNull();
    expect(fetchedCountry?.name).toBe("India");
  });
});
