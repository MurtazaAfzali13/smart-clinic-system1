import type { ReactNode } from "react";

type P = [number, number];
const pts = (v: number[], w: number, h: number, max: number, min = 0): P[] => v.map((y, i) => [(i / (v.length - 1)) * w, h - ((y - min) / (max - min)) * h]);
const smooth = (p: P[]) => p.reduce((d, c, i) => {
  if (!i) return `M${c[0]} ${c[1]}`;
  const a = p[i - 2] ?? p[i - 1], b = p[i - 1], e = p[i + 1] ?? c;
  return `${d}C${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6} ${c[1] - (e[1] - b[1]) / 6} ${c[0]} ${c[1]}`;
}, "");
const Fill = ({ id, color, o = 0.4 }: { id: string; color: string; o?: number }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity={o} /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient>
);

export function Sparkline({ values, color, id }: { values: number[]; color: string; id: string }) {
  const l = smooth(pts(values, 260, 60, Math.max(...values) * 1.05, Math.min(...values) * 0.7));
  return (
    <svg viewBox="0 0 260 60" preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-hidden>
      <defs><Fill id={id} color={color} o={0.45} /></defs>
      <path d={`${l}L260 60L0 60Z`} fill={`url(#${id})`} />
      <path d={l} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

export function AreaChart({ series, labels }: { series: { values: number[]; color: string; id: string }[]; labels: string[] }) {
  const W = 600, H = 200;
  return (
    <div className="mt-4 grid grid-cols-[44px_1fr]">
      <div className="relative h-[190px]">
        {[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className="absolute right-3 -translate-y-1/2 text-[12px] text-[#8fa0c8]" style={{ top: `${i * 20}%` }}>{i === 5 ? "0" : `${100 - i * 20}K`}</span>)}
      </div>
      <div>
        <div className="relative mr-2 h-[190px] border-l border-white/10">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className={`absolute inset-x-0 border-t ${i === 5 ? "border-white/15" : "border-dashed border-white/[.07]"}`} style={{ top: `${i * 20}%` }} />)}
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label="Revenue versus expenses, Jun 30 to Jul 30">
            <defs>{series.map((s) => <Fill key={s.id} id={s.id} color={s.color} o={s.id === "ar-e" ? 0.4 : 0.28} />)}</defs>
            {series.map((s) => { const l = smooth(pts(s.values, W, H, 100)); return (
              <g key={s.id}><path d={`${l}L${W} ${H}L0 ${H}Z`} fill={`url(#${s.id})`} /><path d={l} fill="none" stroke={s.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 6px ${s.color})` }} /></g>
            ); })}
          </svg>
          {series.map((s) => <i key={s.id} className="absolute h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full ring-2 ring-white/70" style={{ right: 0, top: `${100 - s.values[s.values.length - 1]}%`, background: s.color, boxShadow: `0 0 12px 3px ${s.color}` }} />)}
        </div>
        <div className="mr-2 mt-3 flex justify-between px-2 text-[12px] text-[#c4d2f5]">{labels.map((l) => <span key={l}>{l}</span>)}</div>
      </div>
    </div>
  );
}

export type Seg = { value: number; from: string; to: string };
export function Donut({ id, segs, size = 190, stroke = 24, gap = 6, children }: { id: string; segs: Seg[]; size?: number; stroke?: number; gap?: number; children: ReactNode }) {
  const r = (size - stroke) / 2 - 6, c = 2 * Math.PI * r, tot = segs.reduce((a, s) => a + s.value, 0);
  let acc = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90 overflow-visible" aria-hidden>
        <defs>{segs.map((s, i) => <linearGradient key={i} id={`${id}${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={s.from} /><stop offset="1" stopColor={s.to} /></linearGradient>)}</defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.04)" strokeWidth={stroke} />
        {segs.map((s, i) => {
          const len = (s.value / tot) * c, dash = Math.max(len - gap - stroke, 0.5), start = acc + gap / 2 + stroke / 2;
          acc += len;
          return <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id}${i})`} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-start} style={{ filter: `drop-shadow(0 0 8px ${s.to}88)` }} />;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
