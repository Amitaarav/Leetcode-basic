import type { Request, Response, NextFunction } from "express";

export function validateCode(req: Request, res: Response, next: NextFunction) {
      const { code } = req.body;
      if (!code || typeof code !== "string") {
        return res.status(400).json({ success: false, error: "Code must be a string" });
      }
      if (code.length > 5000) {
        return res.status(400).json({ success: false, error: "Code too long (max 5000 chars)" });
      }
      next();
}
