import { Environment } from "nunjucks";

const filters = {
  component: function(str: string): string {
    return `./component/${str}.njk`;
  }
}

export function registerFilters(env: Environment) {
  env.addFilter("component", filters.component);
}