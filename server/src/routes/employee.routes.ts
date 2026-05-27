import { Router } from "express";
import { employeeController } from "../controllers/employee.controller";

export const employeeRouter = Router();

// Define routes with bound controller methods to maintain context ('this' binding)
employeeRouter.get("/", (req, res, next) => employeeController.list(req, res, next));
employeeRouter.post("/", (req, res, next) => employeeController.create(req, res, next));
employeeRouter.put("/:id", (req, res, next) => employeeController.update(req, res, next));
employeeRouter.delete("/:id", (req, res, next) => employeeController.delete(req, res, next));
