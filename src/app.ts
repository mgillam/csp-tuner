import express from "express";
import path from "path";
import nunjucks from "nunjucks";
import ClientRouter from "./clientApi/clientRouter";
import ReportRouter from "./reportApi/reportRouter";
import IDataAdapter from "./types/data/IDataAdapter";
import InMemoryDataAdapter from "./data/InMemoryDataAdapter";
import { registerFilters } from "./view/filters";
import EventEmitter from "events";



const app = express();
const appEventEmitter = new EventEmitter();
const dataAdapter: IDataAdapter = new InMemoryDataAdapter(appEventEmitter);
const port = 3006;

app.use(express.static(path.join(__dirname, "public")));

app.engine("njk", nunjucks.render);
app.set("view engine", "njk");

const nunEnv = nunjucks.configure(path.join(__dirname, "view"), {
  autoescape: true,
  express: app
});

registerFilters(nunEnv);

app.get("/", (req, res, next) => {
  res.redirect("/client");
});

app.use("/client", new ClientRouter(dataAdapter, appEventEmitter).router);
app.use("/report", new ReportRouter(dataAdapter).router);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});