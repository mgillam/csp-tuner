import express from "express";
import IDataAdapter from "../types/data/IDataAdapter";
import { CSPViolationReportJson } from "../types/report";
import cors from "cors";
import bodyParser from "body-parser";

export default class ReportRouter {
  router = express.Router();
  dataAdapater: IDataAdapter;

  constructor(dataAdapter: IDataAdapter) {
    this.dataAdapater = dataAdapter;
    this.router.use(express.json());
    this.router.use(cors());
    this.router.post("/", bodyParser.json({ type: ["application/csp-report", "*/json"] }), async (req, res) => {
      const violationReport: CSPViolationReportJson = req.body;
      dataAdapter.writeViolationReport(violationReport["csp-report"]);
      res.status(204).send();
    });
  }
}