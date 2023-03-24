import bodyParser from "body-parser";
import express from "express";
import applicationRouter from "./applicationRouter";
import { clientInfoMiddleware } from "./middlewares/clientInfo";
import { prismaMiddleWare } from "./middlewares/prisma";

export class Server {
  private app;

  constructor() {
    this.app = express();
    this.config();
    this.routerConfig();
  }

  private config() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: "1mb" })); // 100kb default
    this.app.use(prismaMiddleWare); // attach prisma to request
    this.app.use(clientInfoMiddleware); // attach client info to request
  }

  private async routerConfig() {
    this.app.use("/application", applicationRouter);
  }

  public start = (port: number) => {
    return new Promise((resolve, reject) => {
      this.app
        .listen(port, () => {
          console.log(`Listening on port: ${port}`);
          resolve(port);
        })
        .on("error", (err: Object) => reject(err));
    });
  };
}
