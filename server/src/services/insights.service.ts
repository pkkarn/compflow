import { prisma } from "../db";

export class InsightsService {
  async getCountryInsights(countryId: string) {
    // Verify the country exists
    const country = await prisma.country.findUnique({
      where: { id: countryId },
    });
    
    if (!country) {
      // Return null instead of throwing to avoid 404s in frontend
      return { min: null, max: null, avg: null, currency: 'USD' };
    }

    // Use Prisma's highly optimized aggregate function
    const stats = await prisma.employee.aggregate({
      where: { countryId },
      _min: { salary: true },
      _max: { salary: true },
      _avg: { salary: true },
    });

    return {
      min: stats._min.salary,
      max: stats._max.salary,
      avg: stats._avg.salary,
      currency: 'USD'
    };
  }

  async getJobTitleInsights(countryId: string, jobTitleId: string) {
    const stats = await prisma.employee.aggregate({
      where: { countryId, jobTitleId },
      _min: { salary: true },
      _max: { salary: true },
      _avg: { salary: true },
    });

    return {
      min: stats._min.salary,
      max: stats._max.salary,
      avg: stats._avg.salary,
      currency: 'USD'
    };
  }
}

export const insightsService = new InsightsService();
