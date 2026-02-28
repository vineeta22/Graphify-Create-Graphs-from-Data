// src/utils/autoInsights.jsx
export function detectColumnType(values) {
  if (values.every(v => !isNaN(Date.parse(v)))) return "date";
  if (values.every(v => !isNaN(Number(v)))) return "number";
  return "category";
}

export function detectTrend(values) {
  const nums = values.map(Number).filter(v => !isNaN(v));
  if (nums.length < 2) return "STABLE";

  const mid = Math.floor(nums.length / 2);
  const first = nums.slice(0, mid).reduce((a, b) => a + b, 0);
  const second = nums.slice(mid).reduce((a, b) => a + b, 0);

  if (second > first) return "UP";
  if (second < first) return "DOWN";
  return "STABLE";
}

export function recommendChart(xType, yType) {
  if (xType === "date" && yType === "number") return "line";
  if (xType === "category" && yType === "number") return "bar";
  return "pie";
}
