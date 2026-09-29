import { DollarSign, Wallet, TrendingUp, FileText, Landmark, Receipt, Layers } from "lucide-react";

export const kpis = [
  { t: "green", key: "totalRevenue", value: "$124,560", delta: "+18.5%", up: true, color: "#22e58a", dc: "#22e58a", Icon: TrendingUp, Corner: DollarSign, spark: [22, 24, 20, 26, 30, 28, 34, 30, 36, 32, 38, 34, 40, 36, 42, 38, 44, 40, 46, 42, 50, 46, 52, 48, 54, 50, 58, 62] },
  { t: "purple", key: "totalExpenses", value: "$68,430", delta: "-9.3%", up: false, color: "#d04dff", dc: "#e05cff", Icon: Wallet, Corner: Receipt, spark: [18, 20, 17, 22, 25, 21, 27, 24, 30, 26, 32, 28, 33, 30, 36, 32, 38, 34, 40, 36, 42, 38, 44, 40, 46, 43, 48, 52] },
  { t: "blue", key: "netProfit", value: "$56,130", delta: "+27.4%", up: true, color: "#3b8bff", dc: "#22e58a", Icon: Layers, Corner: Landmark, spark: [14, 17, 15, 20, 18, 23, 19, 26, 22, 28, 24, 30, 26, 33, 29, 36, 31, 38, 34, 41, 37, 44, 40, 47, 43, 50, 47, 54] },
  { t: "amber", key: "outstandingInvoices", value: "$32,780", delta: "", up: true, noteCount: 12, color: "#f5a524", dc: "#f5a524", Icon: FileText, Corner: FileText, spark: [20, 24, 19, 26, 22, 30, 25, 33, 28, 36, 30, 34, 38, 32, 40, 36, 44, 38, 46, 42, 50, 44, 48, 52, 46, 54, 50, 58] },
] as const;

export const xLabels = ["Jun 30", "Jul 5", "Jul 10", "Jul 15", "Jul 20", "Jul 25", "Jul 30"];
export const revenue = [37, 41, 44, 48, 46, 50, 55, 53, 58, 56, 60, 58, 62, 65, 61, 64, 66, 63, 68, 72, 70, 71, 74, 72, 76, 74, 78, 77, 82, 90, 97];
export const expenses = [15, 16, 19, 17, 21, 24, 22, 26, 25, 28, 27, 30, 29, 33, 31, 34, 33, 36, 35, 38, 36, 40, 39, 42, 41, 44, 43, 47, 50, 53, 56];

const G = { from: "#3dffa0", to: "#12c98a" }, B = { from: "#4d9bff", to: "#1f6bff" }, P = { from: "#c96bff", to: "#9a3cff" };
export const cashFlow = [
  { label: "Operating Activities", amount: "$32,450", pct: 58, dot: "#22e58a", ...G },
  { label: "Investing Activities", amount: "$14,200", pct: 25, dot: "#2f7bff", ...B },
  { label: "Financing Activities", amount: "$9,480", pct: 17, dot: "#b44cff", ...P },
];
export const expenseBreakdown = [
  { label: "Materials", amount: "$24,120", pct: 35, dot: "#22e58a", ...G },
  { label: "Labor", amount: "$18,300", pct: 27, dot: "#2f7bff", ...B },
  { label: "Equipment", amount: "$12,450", pct: 18, dot: "#f5a524", from: "#ffb648", to: "#ff7a1a" },
  { label: "Transport", amount: "$7,680", pct: 11, dot: "#b44cff", ...P },
  { label: "Other", amount: "$5,950", pct: 9, dot: "#8a9bd0", from: "#a3b2e0", to: "#6f80b8" },
];
export const projects = [
  { name: "Bridge Construction", v: 42 }, { name: "Road Expansion", v: 34 }, { name: "Building Project", v: 27 }, { name: "Water System", v: 20 }, { name: "Other Projects", v: 14, purple: true },
];
export const transactions = [
  { title: "Invoice #INV-2026-125", date: "Jul 28, 2026", amount: "+$8,750", in: true, status: "Paid" },
  { title: "Payment to Supplier", date: "Jul 27, 2026", amount: "-$2,400", in: false, status: "Expected" },
  { title: "Invoice #INV-2026-124", date: "Jul 26, 2026", amount: "+$12,300", in: true, status: "Paid" },
  { title: "Payroll Payment", date: "Jul 25, 2026", amount: "-$6,850", in: false, status: "Expected" },
  { title: "Project Advance", date: "Jul 24, 2026", amount: "+$15,000", in: true, status: "Paid" },
];
