import express from "express";
import IDataAdapter from "../types/data/IDataAdapter";
import { Metrics } from "../types/data/Metrics";

class ClientRouter {
  router = express.Router();
  dataAdapater: IDataAdapter;

  constructor(dataAdapter: IDataAdapter) {
    this.dataAdapater = dataAdapter;
    this.router.get("/", async (req, res, next) => {
      res.render("dashboardView", { mainComponent: "metrics", metrics: dataAdapter.metrics });
    });

    this.router.get("/violations", async(req, res, next) => {
      res.setHeader("Cache-Controls", "nocache").render("dashboardView", { mainComponent: "violationTable", data: await dataAdapter.listViolationReports() });
    });
    
    this.router.get("/metrics/:metric", async (req, res) => {
      if(Object.keys(dataAdapter.metrics).includes(req.params.metric)) {
        res.setHeader("Cache-Control", "nocache").status(200).send(dataAdapter.metrics[req.params.metric as keyof Metrics].toString());
      } else {
        res.status(404).send("Metric not found");
      }
    });
  }
}

export default ClientRouter;