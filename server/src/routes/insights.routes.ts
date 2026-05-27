import { Router } from "express";
import { insightsController } from "../controllers/insights.controller";

export const insightsRouter = Router();

insightsRouter.get("/country/:countryId", (req, res, next) => insightsController.getCountryInsights(req, res, next));
