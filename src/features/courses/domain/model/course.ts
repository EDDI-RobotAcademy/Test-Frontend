import type { TimeValue } from "@/ui/components/TimePicker";

export type TransportMode = "car" | "walk";

export interface TimeRange {
  start: TimeValue;
  end: TimeValue;
}

export interface CourseDraft {
  place: string;
  date: Date | null;
  time: TimeRange | null;
  preference: string;
  transport: TransportMode | null;
}

export interface Course {
  id: string;
  place: string;
  date: Date;
  time: TimeRange;
  preference: string;
  transport: TransportMode;
  createdAt: Date;
}
