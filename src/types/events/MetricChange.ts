type MetricChangeEvent = {
  metric: "violationCount"|"odvCount";
  value: number;
}

export default MetricChangeEvent;