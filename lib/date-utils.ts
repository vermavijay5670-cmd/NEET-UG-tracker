export function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0");
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseKey(k: string): Date {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((parseKey(dateKey(b)).getTime() - parseKey(dateKey(a)).getTime()) / 86400000);
}

export function weekdayShort(d: Date): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
}

export function fmtHrs(h: number): string {
  return `${(Math.round(h * 10) / 10).toFixed(1)}h`;
}

export function relDays(fromKey: string | null | undefined): string | null {
  if (!fromKey) return null;
  const n = daysBetween(parseKey(fromKey), new Date());
  if (n <= 0) return "today";
  if (n === 1) return "1d ago";
  return `${n}d ago`;
}
