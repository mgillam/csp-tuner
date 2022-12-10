import { OriginDirectiveViolationGroup } from "../OriginDirectiveViolationGroup";
import { CSPViolationJson } from "../report";
import { Metrics } from "./Metrics";

export default interface IDataAdapter {
  writeViolationReport: (violation: CSPViolationJson) => Promise<void>;
  listViolationReports: (offset?: number, limit?: number, filter?: Partial<CSPViolationJson>) => Promise<CSPViolationJson[]>;
  getOriginDirectiveGroups: (filter?: Partial<OriginDirectiveViolationGroup>) => Promise<OriginDirectiveViolationGroup[]>;
  metrics: Metrics;
}