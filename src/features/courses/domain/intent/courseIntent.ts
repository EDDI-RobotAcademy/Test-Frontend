import type { TimeValue } from "@/ui/components/TimePicker";
import type { TransportMode } from "../model/course";

export type CourseIntent =
  | { type: "SET_PLACE"; value: string }
  | { type: "SET_DATE"; value: Date | null }
  | { type: "SET_TIME"; value: TimeValue | null }
  | { type: "SET_PREFERENCE"; value: string }
  | { type: "SET_TRANSPORT"; value: TransportMode | null }
  | { type: "SUBMIT" };
