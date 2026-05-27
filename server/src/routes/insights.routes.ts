import { Router } from "express";
import { insightsController } from "../controllers/insights.controller";

export const insightsRouter = Router();

insightsRouter.get("/country/:countryId", (req, res, next) => insightsController.getCountryInsights(req, res, next));
insightsRouter.get("/country/:countryId/job-title/:jobTitleId", (req, res, next) => insightsController.getJobTitleInsights(req, res, next));
