export type CSPViolationJson = {
  "document-uri": string,
  referrer: string,
  "blocked-uri": string,
  "violated-directive": string,
  "original-policy": string,
  disposition: string
}

export type CSPViolationReportJson = {
  "csp-report": CSPViolationJson
}

export type Timestamped = {
  reportTime: number
}

export type CSPViolationRecord = CSPViolationJson & Timestamped;