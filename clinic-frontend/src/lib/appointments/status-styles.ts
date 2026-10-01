export const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-500",
  confirmed: "bg-emerald-500/15 text-emerald-500",
  completed: "bg-primary/15 text-primary",
  cancelled: "bg-muted text-muted-foreground",
  no_show: "bg-red-500/15 text-red-500",
};

export const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-emerald-500",
  completed: "bg-primary",
  cancelled: "bg-muted-foreground",
  no_show: "bg-red-500",
};

export const STATUS_BORDER: Record<string, string> = {
  pending: "border-amber-500/50",
  confirmed: "border-emerald-500/50",
  completed: "border-primary/50",
  no_show: "border-red-500/50",
};