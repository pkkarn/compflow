import { Request, Response, NextFunction } from "express";
import { employeeService } from "../services/employee.service";

export class EmployeeController {
  /**
   * GET /api/employees
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search ? (req.query.search as string) : undefined;

      // Handle simple validation for NaN parameters
      if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        res.status(400).json({ error: "Invalid pagination parameters" });
        return;
      }

      const result = await employeeService.getEmployees({ page, limit, search });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/employees
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, salary, countryId, jobTitleId } = req.body;

      // Robust payload validation
      if (!fullName || !email || salary === undefined || !countryId || !jobTitleId) {
        res.status(400).json({
          error: "Missing required fields: fullName, email, salary, countryId, jobTitleId are required",
        });
        return;
      }

      if (typeof salary !== "number" || salary < 0) {
        res.status(400).json({ error: "Salary must be a non-negative number" });
        return;
      }

      const newEmployee = await employeeService.createEmployee({
        fullName,
        email,
        salary,
        countryId,
        jobTitleId,
      });

      res.status(201).json(newEmployee);
    } catch (error: any) {
      if (error.message === "Email already registered") {
        res.status(400).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * PUT /api/employees/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { fullName, email, salary, countryId, jobTitleId } = req.body;

      if (!id) {
        res.status(400).json({ error: "Employee ID is required" });
        return;
      }

      // If salary is passed, validate it
      if (salary !== undefined && (typeof salary !== "number" || salary < 0)) {
        res.status(400).json({ error: "Salary must be a non-negative number" });
        return;
      }

      const updatedEmployee = await employeeService.updateEmployee(id, {
        fullName,
        email,
        salary,
        countryId,
        jobTitleId,
      });

      res.status(200).json(updatedEmployee);
    } catch (error: any) {
      if (error.message === "Employee not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * DELETE /api/employees/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;

      if (!id) {
        res.status(400).json({ error: "Employee ID is required" });
        return;
      }

      await employeeService.deleteEmployee(id);
      res.status(200).json({ message: "Employee successfully deleted" });
    } catch (error: any) {
      if (error.message === "Employee not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }
}

export const employeeController = new EmployeeController();
