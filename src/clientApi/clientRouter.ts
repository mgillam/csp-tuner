import express from "express";
import nunjucks from "nunjucks";
import IDataAdapter from "../types/data/IDataAdapter";
import { Metrics } from "../types/data/Metrics";
import EventEmitter from "events";
import MetricChangeEvent from "../types/events/MetricChange";
import { CSPViolationJson } from "../types/report";

function generatePages(start = 0, end: number): number[] {
  const array = [];
  for(let page = start; page <= end; page++) {
    array.push(page);
  }
  return array;
}
class ClientRouter {
  router = express.Router();
  dataAdapater: IDataAdapter;
  eventEmitter: EventEmitter;



  constructor(dataAdapter: IDataAdapter, eventEmitter: EventEmitter) {
    this.dataAdapater = dataAdapter;
    this.eventEmitter = eventEmitter;
    this.router.get("/", async (req, res, next) => {
      res.render("dashboardView", { mainComponent: "metrics", detailComponent: "reportTicker",
        metrics: dataAdapter.metrics,
        tickerItems: await (await dataAdapter.listViolationReports(dataAdapter.metrics.violationCount - 10, 10)).map((item) => JSON.stringify(item))
      });
    });

    this.router.get("/violations/:page?", async(req, res, next) => {
      const page = (req.params.page as number|undefined || 1);
      const pageOffset = (page - 1) * 20;
      const pageCount = Math.ceil(dataAdapter.metrics.violationCount / 20);
      res.setHeader("Cache-Control", "no-cache").render("dashboardView", { mainComponent: "violationTable", 
        data: await dataAdapter.listViolationReports(pageOffset),
        pagination: { 
          currPage: page,
          nextPages: page < pageCount ? generatePages(parseInt(page.toString()) + 1, pageCount) : [],
          prevPages: page > 1 ? generatePages(1, pageCount - 1) : []
        }
      });
    });

    this.router.get("/odv", async(req, res, next) => {
      res.setHeader("Cache-Control", "no-cache").render("dashboardView", { mainComponent: "odvTable",  detailComponent: "reportTicker",
        data: await (await dataAdapter.getOriginDirectiveGroups()).map(odv => { return { uriCount: odv.violatingDocumentURIs.length, ...odv }}), 
        tickerItems: await (await dataAdapter.listViolationReports(dataAdapter.metrics.violationCount - 10, 10)).map((item) => JSON.stringify(item))
      });
    });

    this.router.get("/events/metrics", (req, res, next) => {
      res.set({
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive"
      });
      res.flushHeaders();

      res.write("retry: 10000\n\n");
      const metricChangeHandler = (event: MetricChangeEvent) => {
          res.write(`event: change_${event.metric}\n`)
          res.write(`data: ${event.value}\n\n`);
      }
      eventEmitter.on("metricChange", metricChangeHandler);

      res.on("close", () => {
        eventEmitter.removeListener("metricChange", metricChangeHandler);
      })
    });

    this.router.get("/events/reports", (req, res, next) => {
      res.set({
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive"
      });
      res.flushHeaders();

      res.write("retry: 10000\n\n");
      const reportHandler = (event: CSPViolationJson) => {
          const payload = nunjucks.render("component/reportTickerItem.njk", { item: JSON.stringify(event) });
          res.write("event: cspReport\n")
          res.write(`data: ${payload}\n\n`);
      }
      eventEmitter.on("cspReport", reportHandler);

      res.on("close", () => {
        eventEmitter.removeListener("cspReport", reportHandler);
      })
    });
    
    this.router.get("/metrics/:metric", async (req, res) => {
      if(Object.keys(dataAdapter.metrics).includes(req.params.metric)) {
        res.setHeader("Cache-Control", "no-cache").status(200).send(dataAdapter.metrics[req.params.metric as keyof Metrics].toString());
      } else {
        res.status(404).send("Metric not found");
      }
    });
  }
}

export default ClientRouter;