import type { TimeValue } from "@/ui/components/TimePicker";

export type TransportMode = "car" | "walk";

export interface CourseDraft {
  place: string;
  date: Date | null;
  time: TimeValue | null;
  preference: string;
  transport: TransportMode | null;
}

export interface Course {
  id: string;
  place: string;
  date: Date;
  time: TimeValue;
  preference: string;
  transport: TransportMode;
  createdAt: Date;
}
