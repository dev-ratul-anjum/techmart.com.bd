import { Request, Response, NextFunction } from "express";

export const parseJsonFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
      fields.forEach((field) => {
        if (req.body[field] && typeof req.body[field] === "string") {
          try {
            req.body[field] = JSON.parse(req.body[field]);
          } catch (error) {
            // If json parse fails, leave it as string; schema validation will catch it if invalid
          }
        }
      });
    }
    next();
  };
};
