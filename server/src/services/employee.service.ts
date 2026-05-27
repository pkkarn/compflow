import { prisma } from "../db";

export interface GetEmployeesQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateEmployeeInput {
  fullName: string;
  email: string;
  salary: number;
  countryId: string;
  jobTitleId: string;
}

export interface UpdateEmployeeInput {
  fullName?: string;
  email?: string;
  salary?: number;
  countryId?: string;
  jobTitleId?: string;
}

export class EmployeeService {
  /**
   * Fetches employees with cursor/offset pagination and case-insensitive search by name
   */
  async getEmployees({ page = 1, limit = 10, search }: GetEmployeesQuery) {
    const skip = (page - 1) * limit;

    // Build Prisma query filters
    const where: any = {};
    if (search) {
      where.fullName = {
        contains: search,
      };
    }

    // Run count and data fetch in parallel for high performance
    const [total, data] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          country: true,
          jobTitle: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Creates a new employee record after checking email uniqueness
   */
  async createEmployee(input: CreateEmployeeInput) {
    // Check if email already exists
    const existing = await prisma.employee.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error("Email already registered");
    }

    return await prisma.employee.create({
      data: input,
      include: {
        country: true,
        jobTitle: true,
      },
    });
  }

  /**
   * Updates an existing employee details
   */
  async updateEmployee(id: string, input: UpdateEmployeeInput) {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new Error("Employee not found");
    }

    return await prisma.employee.update({
      where: { id },
      data: input,
      include: {
        country: true,
        jobTitle: true,
      },
    });
  }

  /**
   * Deletes an employee record
   */
  async deleteEmployee(id: string) {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new Error("Employee not found");
    }

    return await prisma.employee.delete({
      where: { id },
    });
  }
}

export const employeeService = new EmployeeService();
