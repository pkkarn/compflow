import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/db";
import { seedDatabase } from "../src/seed";

describe("Salary Insights API Integration Tests", () => {
  let testCountryId: string;
  let testJobTitleId: string;

  // We need data to run insights against, so we seed the database first
  beforeAll(async () => {
    await seedDatabase();

    // Grab a random country and job title to test with
    const country = await prisma.country.findFirst();
    const jobTitle = await prisma.jobTitle.findFirst();

    testCountryId = country!.id;
    testJobTitleId = jobTitle!.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/insights/country/:countryId", () => {
    test("should return min, max, and avg salary for a given country", async () => {
      const response = await request(app)
        .get(`/api/insights/country/${testCountryId}`)
        .expect(200);

      // Verify the structure of the response
      expect(response.body).toHaveProperty("countryId", testCountryId);
      expect(response.body).toHaveProperty("minSalary");
      expect(response.body).toHaveProperty("maxSalary");
      expect(response.body).toHaveProperty("avgSalary");

      // Salaries should be numbers
      expect(typeof response.body.minSalary).toBe("number");
      expect(typeof response.body.maxSalary).toBe("number");
      expect(typeof response.body.avgSalary).toBe("number");

      // Basic logical assertions
      expect(response.body.minSalary).toBeGreaterThan(0);
      expect(response.body.maxSalary).toBeGreaterThanOrEqual(response.body.minSalary);
      expect(response.body.avgSalary).toBeGreaterThanOrEqual(response.body.minSalary);
      expect(response.body.avgSalary).toBeLessThanOrEqual(response.body.maxSalary);
    });

    test("should return 404 if the country does not exist", async () => {
      await request(app)
        .get("/api/insights/country/non-existent-uuid")
        .expect(404);
    });
  });
});
