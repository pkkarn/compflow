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
}

export const insightsController = new InsightsController();
