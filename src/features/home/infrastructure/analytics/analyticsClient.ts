export type AnalyticsEvent =
  | { name: "home_form_entered"; at: string }
  | { name: "home_form_default_date_applied"; at: string };

export function emit(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const sink = (window as unknown as {
    __analytics?: { push: (event: AnalyticsEvent) => void };
  }).__analytics;
  if (sink && typeof sink.push === "function") {
    sink.push(event);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event);
  }
}
