import type { DisabledDatesProp } from "./types";

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfterDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const targetMonth = d.getMonth() + months;
  d.setDate(1);
  d.setMonth(targetMonth);
  const lastDayOfTarget = new Date(
    d.getFullYear(),
    d.getMonth() + 1,
    0,
  ).getDate();
  d.setDate(Math.min(date.getDate(), lastDayOfTarget));
  return d;
}

export function addYears(date: Date, years: number): Date {
  return addMonths(date, years * 12);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfWeek(date: Date, weekStartsOn: 0 | 1): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  return addDays(d, -diff);
}

export function buildMonthGrid(
  monthAnchor: Date,
  weekStartsOn: 0 | 1,
): Date[] {
  const monthStart = startOfMonth(monthAnchor);
  const gridStart = startOfWeek(monthStart, weekStartsOn);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(addDays(gridStart, i));
  }
  return days;
}

export function isDateDisabled(
  date: Date,
  args: { min?: Date; max?: Date; disabledDates?: DisabledDatesProp },
): boolean {
  if (args.min && isBeforeDay(date, args.min)) return true;
  if (args.max && isAfterDay(date, args.max)) return true;
  const dd = args.disabledDates;
  if (!dd) return false;
  if (typeof dd === "function") return dd(date);
  return dd.some((d) => isSameDay(d, date));
}

export function clampToBounds(
  date: Date,
  min?: Date,
  max?: Date,
): Date {
  if (min && isBeforeDay(date, min)) return startOfDay(min);
  if (max && isAfterDay(date, max)) return startOfDay(max);
  return startOfDay(date);
}

export function formatMonthYear(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatWeekday(
  date: Date,
  locale?: string,
  format: "short" | "narrow" = "short",
): string {
  return new Intl.DateTimeFormat(locale, { weekday: format }).format(date);
}

export function formatDate(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatDateLong(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}
