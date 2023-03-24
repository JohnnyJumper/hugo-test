import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    prisma: PrismaClient;
  }
}

export const prismaMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.prisma = new PrismaClient();
  next();
};
