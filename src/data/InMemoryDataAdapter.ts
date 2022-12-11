import IDataAdapter from "../types/data/IDataAdapter";
import { Metrics } from "../types/data/Metrics";
import { OriginDirectiveViolationGroup } from "../types/OriginDirectiveViolationGroup";
import { CSPViolationJson, CSPViolationRecord } from "../types/report";
import EventEmitter from "events";
import MetricChangeEvent from "../types/events/MetricChange";

class InMemoryDataAdapter implements IDataAdapter {
  private violationReports: CSPViolationRecord[] = [];
  private originDirectiveViolationGroups: OriginDirectiveViolationGroup[] = [];
  metrics: Metrics = { odvCount: 0, violationCount: 0 };
  eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  private updateMetrics() {
    const newOdvCount = this.originDirectiveViolationGroups.length;
    const newViolationCount = this.violationReports.length;
    if(this.metrics.odvCount !== newOdvCount) {
      this.metrics.odvCount = this.originDirectiveViolationGroups.length;
      this.eventEmitter.emit("metricChange", { metric: "odvCount", value: newOdvCount } as MetricChangeEvent);
    }
    if(this.metrics.violationCount !== newViolationCount) {
      this.metrics.violationCount = this.violationReports.length;
      this.eventEmitter.emit("metricChange", { metric: "violationCount", value: newViolationCount } as MetricChangeEvent);
    }
  }

  async writeViolationReport(violation: CSPViolationJson): Promise<void> {
    this.eventEmitter.emit("cspReport", violation);
    this.violationReports.push({ reportTime: new Date().getTime(), ...violation});
    const blockedUriDomain = /(?<=https?:\/\/)[^/]+/gmi.exec(violation["blocked-uri"]);
    const origin = blockedUriDomain ? blockedUriDomain[0] : "";
    const directive = violation["violated-directive"].split(" ")[0];
    const violationGroupIndex = this.originDirectiveViolationGroups.findIndex((odvGroup) => 
      odvGroup.directive === directive && odvGroup.resourceSource === origin
    );
    if(violationGroupIndex === -1) {
      this.originDirectiveViolationGroups.push({
        directive: directive,
        resourceSource: origin,
        violatingDocumentURIs: [violation["document-uri"]]
      });
    } else {
      if(this.originDirectiveViolationGroups[violationGroupIndex].violatingDocumentURIs.findIndex((uri) => uri === violation["document-uri"]) === -1) {
        this.originDirectiveViolationGroups[violationGroupIndex].violatingDocumentURIs.push(violation["document-uri"]);
      }
    }
    this.updateMetrics();
    return;
  }

  async listViolationReports(offset = 0, limit = this.violationReports.length, filter: Partial<CSPViolationJson> = {}): Promise<CSPViolationRecord[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.violationReports);
      } catch(err) {
        reject(err);
      }
    });
  }

  getOriginDirectiveGroups(filter?: Partial<OriginDirectiveViolationGroup> | undefined): Promise<OriginDirectiveViolationGroup[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.originDirectiveViolationGroups);
      } catch(err) {
        reject(err);
      }
    });
  }

}

export default InMemoryDataAdapter;
