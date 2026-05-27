import { Request, Response, NextFunction } from "express";
import { insightsService } from "../services/insights.service";

export class InsightsController {
  /**
   * GET /api/insights/country/:countryId
   */
  async getCountryInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const countryId = req.params.countryId as string;
      const data = await insightsService.getCountryInsights(countryId);
      res.status(200).json(data);
    } catch (error: any) {
      if (error.message === "Country not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }

  /**
   * GET /api/insights/country/:countryId/job-title/:jobTitleId
   */
  async getJobTitleInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const countryId = req.params.countryId as string;
      const jobTitleId = req.params.jobTitleId as string;
      const data = await insightsService.getJobTitleInsights(countryId, jobTitleId);
      res.status(200).json(data);
    } catch (error: any) {
      if (error.message === "No data found for this country and job title") {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  }
}

export const insightsController = new InsightsController();
