import type { Bucket } from "./filter";

export function pickLabels(buckets: string[], locale: string, bucket: Bucket) {
  const n = buckets.length;
  if (!n) return [];
  const k = Math.min(bucket === "month" ? 12 : 7, n);
  const fmt = new Intl.DateTimeFormat(locale, bucket === "month" ? { month: "short" } : { month: "short", day: "numeric" });
  return Array.from({ length: k }, (_, i) => {
    const idx = k === 1 ? 0 : Math.round((i * (n - 1)) / (k - 1));
    return fmt.format(new Date(`${buckets[idx]}T00:00:00`));
  });
}