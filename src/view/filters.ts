import { Environment } from "nunjucks";
import dayjs from "dayjs";

const filters = {
  component: function(str: string): string {
    return `./component/${str}.njk`;
  },
  timestamp: function(num: number): string {
    const parsedDay = dayjs(num);
    return parsedDay.format("YYYYMMDD-THH:mm:ss.SSS");
  }
}

export function registerFilters(env: Environment) {
  env.addFilter("component", filters.component);
  env.addFilter("timestamp", filters.timestamp);
}