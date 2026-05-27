import fs from "fs";
import path from "path";
import { prisma } from "./db";

// Core countries and job titles to distribute among the 10,000 employees
const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Germany", "Singapore"];
const JOB_TITLES = [
  "Software Engineer",
  "HR Manager",
  "Product Manager",
  "Data Scientist",
  "Sales Director",
  "Financial Analyst",
  "UX Designer",
  "QA Engineer",
  "DevOps Specialist",
  "Marketing Lead",
];

export async function seedDatabase() {
  // 1. Read first and last names from local text files
  const firstNamesPath = path.join(__dirname, "../first_names.txt");
  const lastNamesPath = path.join(__dirname, "../last_names.txt");

  const firstNames = fs.readFileSync(firstNamesPath, "utf-8")
    .split("\n")
    .map(name => name.trim())
    .filter(Boolean);

  const lastNames = fs.readFileSync(lastNamesPath, "utf-8")
    .split("\n")
    .map(name => name.trim())
    .filter(Boolean);

  // Validate we have enough names to cross-multiply to 10,000
  if (firstNames.length * lastNames.length < 10000) {
    throw new Error(
      `Insufficient source names: ${firstNames.length} first names * ${lastNames.length} last names is less than 10,000.`
    );
  }

  // 2. Pre-create Countries and Job Titles in the database
  // Wipe any existing metadata first to prevent unique constraint failures
  await prisma.employee.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.jobTitle.deleteMany({});

  // Seed metadata tables in bulk
  await prisma.country.createMany({
    data: COUNTRIES.map(name => ({ name })),
  });

  await prisma.jobTitle.createMany({
    data: JOB_TITLES.map(title => ({ title })),
  });

  // Query them back to obtain their database IDs
  const countries = await prisma.country.findMany();
  const jobTitles = await prisma.jobTitle.findMany();

  // 3. Generate 10,000 unique employees using Cartesian product (First * Last)
  const employeeData: Array<{
    fullName: string;
    email: string;
    salary: number;
    countryId: string;
    jobTitleId: string;
  }> = [];

  let count = 0;
  for (const firstName of firstNames) {
    for (const lastName of lastNames) {
      if (count >= 10000) break;

      const fullName = `${firstName} ${lastName}`;
      // Clean email names (removing spaces, converting to lowercase)
      const cleanEmailName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
      
      // Ensure absolute email uniqueness by appending counter if necessary
      const email = `${cleanEmailName}.${count}@compflow.com`;

      // Assign deterministic yet evenly distributed salaries, countries, and job titles
      const salary = Math.floor(40000 + (count % 16) * 10000); // Salaries range from $40k to $190k
      const countryId = countries[count % countries.length]!.id;
      const jobTitleId = jobTitles[count % jobTitles.length]!.id;

      employeeData.push({
        fullName,
        email,
        salary,
        countryId,
        jobTitleId,
      });

      count++;
    }
    if (count >= 10000) break;
  }

  // 4. Perform highly optimized bulk insertion inside a single database write transaction
  await prisma.employee.createMany({
    data: employeeData,
  });
}
