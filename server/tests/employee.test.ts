import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/db";
import { seedDatabase } from "../src/seed";

describe("Employee CRUD API Integration Tests", () => {
  let testCountryId: string;
  let testJobTitleId: string;
  let testEmployeeId: string;

  // Run seeding once before all CRUD tests so we have 10,000 active employees to test pagination and scale!
  beforeAll(async () => {
    await seedDatabase();

    // Query a generated country and job title to use as foreign keys for our POST test
    const country = await prisma.country.findFirst();
    const jobTitle = await prisma.jobTitle.findFirst();
    const employee = await prisma.employee.findFirst();

    testCountryId = country!.id;
    testJobTitleId = jobTitle!.id;
    testEmployeeId = employee!.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/employees", () => {
    test("should fetch a paginated list of employees", async () => {
      const limit = 10;
      const response = await request(app)
        .get(`/api/employees?page=1&limit=${limit}`)
        .expect(200);

      // Verify structure is paginated and holds data
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("meta");
      expect(response.body.data).toHaveLength(limit);
      expect(response.body.meta).toEqual(
        expect.objectContaining({
          total: 10000,
          page: 1,
          limit: 10,
          totalPages: 1000,
        })
      );
    });

    test("should support search queries by employee name", async () => {
      // Find a known employee name
      const sample = await prisma.employee.findFirst();
      const searchName = sample!.fullName;

      const response = await request(app)
        .get(`/api/employees?search=${searchName}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].fullName).toBe(searchName);
    });
  });

  describe("POST /api/employees", () => {
    test("should successfully create a new employee", async () => {
      const newEmployeeData = {
        fullName: "Test HR Candidate",
        email: "hr.candidate.test@compflow.com",
        salary: 125000,
        countryId: testCountryId,
        jobTitleId: testJobTitleId,
      };

      const response = await request(app)
        .post("/api/employees")
        .send(newEmployeeData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.fullName).toBe(newEmployeeData.fullName);
      expect(response.body.email).toBe(newEmployeeData.email);
      expect(response.body.salary).toBe(newEmployeeData.salary);
      expect(response.body.countryId).toBe(newEmployeeData.countryId);
      expect(response.body.jobTitleId).toBe(newEmployeeData.jobTitleId);
    });

    test("should return 400 validation error if required fields are missing", async () => {
      const invalidData = {
        fullName: "Missing Fields",
        // missing email, salary, countryId, jobTitleId
      };

      await request(app)
        .post("/api/employees")
        .send(invalidData)
        .expect(400);
    });
  });

  describe("PUT /api/employees/:id", () => {
    test("should successfully update employee details", async () => {
      const updateData = {
        fullName: "Updated Name",
        salary: 155000,
      };

      const response = await request(app)
        .put(`/api/employees/${testEmployeeId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.fullName).toBe(updateData.fullName);
      expect(response.body.salary).toBe(updateData.salary);

      // Verify database reflects the change
      const updatedInDb = await prisma.employee.findUnique({
        where: { id: testEmployeeId },
      });
      expect(updatedInDb?.fullName).toBe(updateData.fullName);
      expect(updatedInDb?.salary).toBe(updateData.salary);
    });
  });

  describe("DELETE /api/employees/:id", () => {
    test("should successfully delete an employee", async () => {
      // Create a temporary employee to delete
      const tempEmp = await prisma.employee.create({
        data: {
          fullName: "Temp To Delete",
          email: "temp.delete@compflow.com",
          salary: 50000,
          countryId: testCountryId,
          jobTitleId: testJobTitleId,
        },
      });

      await request(app)
        .delete(`/api/employees/${tempEmp.id}`)
        .expect(200);

      // Verify they no longer exist in the database
      const deletedFromDb = await prisma.employee.findUnique({
        where: { id: tempEmp.id },
      });
      expect(deletedFromDb).toBeNull();
    });
  });
});
