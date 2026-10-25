import type { ReactNode, ComponentType } from "react";

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`fd-glass rounded-[20px] p-5 ${className}`}>{children}</section>
);

export const Head = ({ Icon, title, right }: { Icon: ComponentType<{ className?: string }>; title: string; right?: ReactNode }) => (
  <div className="flex items-center gap-3">
    <span className="fd-badge"><Icon className="h-[18px] w-[18px]" /></span>
    <h2 className="flex-1 text-[17px] font-semibold">{title}</h2>
    {right}
  </div>
);