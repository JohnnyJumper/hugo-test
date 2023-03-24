import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    clientInfo: {
      baseUrl: string;
    };
  }
}

export const clientInfoMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.clientInfo = {
    baseUrl: "http://localhost:6357",
  };
  next();
};
