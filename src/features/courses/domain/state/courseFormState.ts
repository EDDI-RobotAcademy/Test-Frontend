export type CourseFormStatus =
  | "IDLE"
  | "SUBMITTING"
  | "SUBMITTED"
  | "ERROR";

export type CourseFieldKey =
  | "place"
  | "date"
  | "time"
  | "preference"
  | "transport";

export type CourseFieldErrors = Record<CourseFieldKey, string | null>;
