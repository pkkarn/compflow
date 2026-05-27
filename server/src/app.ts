import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import { employeeRouter } from "./routes/employee.routes";
import { insightsRouter } from "./routes/insights.routes";

export const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// Swagger interactive API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes mapping
app.use("/api/employees", employeeRouter);
app.use("/api/insights", insightsRouter);

// Basic Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Centralized error-handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
