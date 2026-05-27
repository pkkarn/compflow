import { prisma } from "../db";

export class GraphService {
  async getGraphData(searchQuery?: string) {
    const nodes: any[] = [];
    const links: any[] = [];

    // Root node
    nodes.push({ id: 'root', label: 'CompFlow', type: 'company', val: 25 });

    // 1. Fetch Countries
    const countries = await prisma.country.findMany();
    countries.forEach(c => {
      nodes.push({ id: c.id, label: c.name, type: 'country', val: 20 });
      links.push({ source: 'root', target: c.id });
    });

    // 2. Fetch Job Titles and Avg Salaries
    const jobStats = await prisma.employee.groupBy({
      by: ['countryId', 'jobTitleId'],
      _avg: { salary: true },
      _count: { _all: true }
    });

    const jobTitles = await prisma.jobTitle.findMany();
    const jobTitleMap = new Map(jobTitles.map(j => [j.id, j.title]));

    jobStats.forEach(stat => {
      const jobIdNode = `${stat.countryId}-${stat.jobTitleId}`;
      const title = jobTitleMap.get(stat.jobTitleId) || 'Unknown';
      const avgSal = stat._avg.salary ? Math.round(stat._avg.salary) : 0;
      
      nodes.push({
        id: jobIdNode,
        label: `${title}\nAvg: $${avgSal.toLocaleString()} (${stat._count._all})`,
        type: 'job',
        val: 15
      });
      links.push({ source: stat.countryId, target: jobIdNode });
    });

    // 3. If search query exists, fetch matching employees and link them
    if (searchQuery && searchQuery.trim().length > 0) {
      const searchTerms = searchQuery.trim().split(/\s+/);
      const employees = await prisma.employee.findMany({
        where: {
          AND: searchTerms.map(term => ({
            OR: [
              { fullName: { contains: term } },
              { email: { contains: term } }
            ]
          }))
        },
        take: 50 // Cap at 50 to prevent massive canvas lag on broad searches
      });

      employees.forEach(emp => {
        nodes.push({
          id: emp.id,
          label: `${emp.fullName}\n$${emp.salary.toLocaleString()}`,
          type: 'employee',
          val: 8
        });
        const parentJobId = `${emp.countryId}-${emp.jobTitleId}`;
        links.push({ source: parentJobId, target: emp.id });
      });
    }

    return { nodes, links };
  }
}

export const graphService = new GraphService();
