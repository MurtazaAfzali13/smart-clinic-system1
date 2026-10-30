import type { DashboardRange } from "./filter";
import type { BreakdownRow, DailyRow, StatusRow, TrendRow } from "./queries";

const D = (s: string) => new Date(`${s}T00:00:00Z`);
const fmt = (d: Date) => d.toISOString().slice(0, 10);

function bucketStart(s: string, b: DashboardRange["bucket"]) {
  const d = D(s);
  if (b === "month") d.setUTCDate(1);
  else if (b === "week") d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return fmt(d);
}

function nextBucket(s: string, b: DashboardRange["bucket"]) {
  const d = D(s);
  if (b === "day") d.setUTCDate(d.getUTCDate() + 1);
  else if (b === "week") d.setUTCDate(d.getUTCDate() + 7);
  else d.setUTCMonth(d.getUTCMonth() + 1);
  return fmt(d);
}

export function selectTrend(rows: DailyRow[], range: DashboardRange): TrendRow[] {
  const m = new Map<string, TrendRow>();
  for (let b = bucketStart(range.from, range.bucket); b <= range.to; b = nextBucket(b, range.bucket)) {
    m.set(b, { bucket: b, total: 0, completed: 0, cancelled: 0 });
  }
  for (const r of rows) {
    const row = m.get(bucketStart(r.day, range.bucket));
    if (!row) continue;
    row.total += r.total;
    if (r.status === "completed") row.completed += r.total;
    else if (r.status === "cancelled" || r.status === "no_show") row.cancelled += r.total;
  }
  return [...m.values()];
}

export function selectStatus(rows: DailyRow[]): StatusRow[] {
  const m = new Map<string, number>();
  for (const r of rows) m.set(r.status, (m.get(r.status) ?? 0) + r.total);
  return [...m].map(([status, total]) => ({ status, total }));
}


/** index 0 = یکشنبه … 6 = شنبه (مثل getUTCDay) */
export function selectWeekdays(rows: DailyRow[]): number[] {
  const out = [0, 0, 0, 0, 0, 0, 0];
  for (const r of rows) out[D(r.day).getUTCDay()] += r.total;
  return out;
}

export type Breakdown = {
  specialties: { key: string; name: string; total: number }[];
  first: number;
  followUp: number;
  total: number;
};

export function selectBreakdown(rows: BreakdownRow[], fa: boolean): Breakdown {
  const sp = new Map<string, { key: string; name: string; total: number }>();
  let first = 0, followUp = 0;
  for (const r of rows) {
    if (r.is_first_visit) first += r.total; else followUp += r.total;
    const key = r.specialty_id ?? "none";
    const name = (fa ? r.name_fa ?? r.name_en : r.name_en ?? r.name_fa) ?? "";
    const cur = sp.get(key);
    if (cur) cur.total += r.total; else sp.set(key, { key, name, total: r.total });
  }
  return { specialties: [...sp.values()].sort((a, b) => b.total - a.total), first, followUp, total: first + followUp };
}