import { prisma } from "../db";

export class InsightsService {
  async getCountryInsights(countryId: string) {
    // Verify the country exists
    const country = await prisma.country.findUnique({
      where: { id: countryId },
    });
    
    if (!country) {
      throw new Error("Country not found");
    }

    // Use Prisma's highly optimized aggregate function
    const stats = await prisma.employee.aggregate({
      where: { countryId },
      _min: { salary: true },
      _max: { salary: true },
      _avg: { salary: true },
    });

    return {
      countryId,
      minSalary: stats._min.salary || 0,
      maxSalary: stats._max.salary || 0,
      avgSalary: stats._avg.salary || 0,
    };
  }

  async getJobTitleInsights(countryId: string, jobTitleId: string) {
    const stats = await prisma.employee.aggregate({
      where: { countryId, jobTitleId },
      _avg: { salary: true },
    });

    if (stats._avg.salary === null) {
      throw new Error("No data found for this country and job title");
    }

    return {
      countryId,
      jobTitleId,
      avgSalary: stats._avg.salary,
    };
  }
}

export const insightsService = new InsightsService();
