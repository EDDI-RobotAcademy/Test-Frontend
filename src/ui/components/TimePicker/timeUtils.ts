import type { TimeFormat, TimePeriod, TimeStep, TimeValue } from "./types";

export function totalSeconds(time: TimeValue): number {
  return time.hours * 3600 + time.minutes * 60 + time.seconds;
}

export function clampUnit(value: number, max: number): number {
  if (value < 0) return 0;
  if (value > max) return max;
  return value;
}

export function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

export function isSameTime(a: TimeValue, b: TimeValue): boolean {
  return a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds;
}

export function getStep(step: TimeStep | undefined, unit: keyof TimeStep): number {
  const fallback: Record<keyof TimeStep, number> = {
    hour: 1,
    minute: 1,
    second: 1,
  };
  const v = step?.[unit];
  return v && v > 0 ? v : fallback[unit];
}

export function getHourOptions(format: TimeFormat, step: number): number[] {
  if (format === "24h") {
    const opts: number[] = [];
    for (let h = 0; h < 24; h += step) opts.push(h);
    return opts;
  }
  const opts: number[] = [];
  for (let h = 1; h <= 12; h += step) opts.push(h);
  return opts;
}

export function getMinuteOptions(step: number): number[] {
  const opts: number[] = [];
  for (let m = 0; m < 60; m += step) opts.push(m);
  return opts;
}

export function getSecondOptions(step: number): number[] {
  return getMinuteOptions(step);
}

export function to12Hour(hour24: number): { hour12: number; period: TimePeriod } {
  const period: TimePeriod = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, period };
}

export function from12Hour(hour12: number, period: TimePeriod): number {
  const base = hour12 % 12;
  return period === "AM" ? base : base + 12;
}

export function withinBounds(
  time: TimeValue,
  min: TimeValue | undefined,
  max: TimeValue | undefined,
): boolean {
  const cur = totalSeconds(time);
  if (min && cur < totalSeconds(min)) return false;
  if (max && cur > totalSeconds(max)) return false;
  return true;
}

export function formatTime(
  time: TimeValue,
  args: { format: TimeFormat; showSeconds: boolean; locale?: string },
): string {
  const useTwelve = args.format === "12h";
  if (useTwelve) {
    const { hour12, period } = to12Hour(time.hours);
    const base = `${pad2(hour12)}:${pad2(time.minutes)}`;
    const withSeconds = args.showSeconds ? `${base}:${pad2(time.seconds)}` : base;
    return `${withSeconds} ${period}`;
  }
  const base = `${pad2(time.hours)}:${pad2(time.minutes)}`;
  return args.showSeconds ? `${base}:${pad2(time.seconds)}` : base;
}

export function clampToBounds(
  time: TimeValue,
  min: TimeValue | undefined,
  max: TimeValue | undefined,
): TimeValue {
  const cur = totalSeconds(time);
  if (min && cur < totalSeconds(min)) return { ...min };
  if (max && cur > totalSeconds(max)) return { ...max };
  return time;
}

export function emptyTime(): TimeValue {
  return { hours: 0, minutes: 0, seconds: 0 };
}
