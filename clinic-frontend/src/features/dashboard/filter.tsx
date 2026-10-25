"use client";
import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from "react";

export type Preset = "last7" | "thisMonth" | "thisYear" | "custom";
export type Bucket = "day" | "week" | "month";
export type DashboardRange = { from: string; to: string; bucket: Bucket };

type State = { preset: Preset; customFrom: string; customTo: string; doctorId: string | null };
type Action =
  | { type: "preset"; preset: Preset }
  | { type: "custom"; from: string; to: string }
  | { type: "doctor"; doctorId: string | null };

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function init(): State {
  const now = new Date();
  return { preset: "thisMonth", customFrom: iso(new Date(now.getFullYear(), now.getMonth(), 1)), customTo: iso(now), doctorId: null };
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "preset":
      return { ...s, preset: a.preset };
    case "custom": {
      const [from, to] = a.from <= a.to ? [a.from, a.to] : [a.to, a.from];
      return { ...s, preset: "custom", customFrom: from, customTo: to };
    }
    case "doctor":
      return { ...s, doctorId: a.doctorId };
  }
}

function resolve(s: State): DashboardRange {
  const now = new Date();
  const today = iso(now);
  if (s.preset === "last7") {
    const f = new Date(now);
    f.setDate(f.getDate() - 6);
    return { from: iso(f), to: today, bucket: "day" };
  }
  if (s.preset === "thisMonth") {
    return {
      from: iso(new Date(now.getFullYear(), now.getMonth(), 1)),
      to: iso(new Date(now.getFullYear(), now.getMonth() + 1, 0)), // آخر ماه
      bucket: "day",
    };
  }
  if (s.preset === "thisYear") {
    return {
      from: iso(new Date(now.getFullYear(), 0, 1)),
      to: iso(new Date(now.getFullYear(), 11, 31)), // آخر سال
      bucket: "month",
    };
  }
  const days = (Date.parse(s.customTo) - Date.parse(s.customFrom)) / 864e5 + 1;
  return { from: s.customFrom, to: s.customTo, bucket: days <= 62 ? "day" : days <= 200 ? "week" : "month" };
}
const StateCtx = createContext<{ state: State; range: DashboardRange } | null>(null);
const DispatchCtx = createContext<Dispatch<Action> | null>(null);

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const value = useMemo(() => ({ state, range: resolve(state) }), [state]);
  return (
    <DispatchCtx.Provider value={dispatch}>
      <StateCtx.Provider value={value}>{children}</StateCtx.Provider>
    </DispatchCtx.Provider>
  );
}

export function useDashboardFilter() {
  const v = useContext(StateCtx);
  if (!v) throw new Error("useDashboardFilter must be used inside <DashboardFilterProvider>");
  return v;
}
export function useDashboardFilterDispatch() {
  const v = useContext(DispatchCtx);
  if (!v) throw new Error("useDashboardFilterDispatch must be used inside <DashboardFilterProvider>");
  return v;
}