import { RequestHandler} from "express";

export function hxHandler(func: RequestHandler, route?: string): RequestHandler {
  return (req, res, next) => {
    if(req.header("HX-Request") === "true") {
      if(route) {
        res.setHeader("HX-Push", route);
      }
      return func(req, res, next);
    } else {
      next();
    }
  }
}