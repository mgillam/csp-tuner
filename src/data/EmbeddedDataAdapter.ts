/* eslint-disable @typescript-eslint/no-explicit-any */
import { Level } from "level";
import path from "path";
import IDataAdapter from "../types/data/IDataAdapter";
import { Metrics } from "../types/data/Metrics";
import { OriginDirectiveViolationGroup } from "../types/OriginDirectiveViolationGroup";
import { CSPViolationJson, CSPViolationRecord } from "../types/report";

class EmbeddedDataAdapter implements IDataAdapter {
  db: Level<string, any>;
  metrics: Metrics = {
    odvCount: 0,
    violationCount: 0
  }

  constructor(filePath?: string) {
    const dbPath = path.join(process.cwd(), filePath || "", "db");
    this.db = new Level<string, any>(dbPath, { valueEncoding: "json" });
  }
  async listViolationReports(offset?: number | undefined, limit?: number | undefined, filter?: Partial<CSPViolationJson> | undefined): Promise<CSPViolationRecord[]> {
    throw new Error("Not implemented");
  }

  async getOriginDirectiveGroups(filter?: Partial<OriginDirectiveViolationGroup> | undefined): Promise<OriginDirectiveViolationGroup[]> {
    throw new Error("Not implemented");
  }

  async writeViolationReport(violation: CSPViolationJson): Promise<void> {
    return this.db.put(Date.now().toString(), violation);
  }
}

export default EmbeddedDataAdapter;
