import { Router } from "express";
import { employeeController } from "../controllers/employee.controller";
import { prisma } from "../db";

export const employeeRouter = Router();

// Metadata endpoints for UI dropdowns
employeeRouter.get("/countries", async (req, res) => {
  const countries = await prisma.country.findMany();
  res.json(countries);
});

employeeRouter.get("/job-titles", async (req, res) => {
  const jobTitles = await prisma.jobTitle.findMany();
  res.json(jobTitles);
});

// Define routes with bound controller methods to maintain context ('this' binding)
employeeRouter.get("/", (req, res, next) => employeeController.list(req, res, next));
employeeRouter.post("/", (req, res, next) => employeeController.create(req, res, next));
employeeRouter.put("/:id", (req, res, next) => employeeController.update(req, res, next));
employeeRouter.delete("/:id", (req, res, next) => employeeController.delete(req, res, next));
