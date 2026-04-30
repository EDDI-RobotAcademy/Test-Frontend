"use client";

import { useCallback } from "react";
import { emit } from "../../infrastructure/analytics/analyticsClient";

export function useTrackHomeEntry() {
  return useCallback(() => {
    emit({ name: "home_form_entered", at: new Date().toISOString() });
  }, []);
}

export function useTrackDefaultDateApplied() {
  return useCallback(() => {
    emit({
      name: "home_form_default_date_applied",
      at: new Date().toISOString(),
    });
  }, []);
}
