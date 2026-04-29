import { atom } from "jotai";
import type { TimeValue } from "@/ui/components/TimePicker";
import type { TransportMode } from "../../domain/model/course";
import type { CourseFormStatus } from "../../domain/state/courseFormState";

export const placeAtom = atom<string>("");
export const dateAtom = atom<Date | null>(null);
export const timeAtom = atom<TimeValue | null>(null);
export const preferenceAtom = atom<string>("");
export const transportAtom = atom<TransportMode | null>(null);

export const formStatusAtom = atom<CourseFormStatus>("IDLE");
export const submissionErrorAtom = atom<string | null>(null);

export const submitAttemptedAtom = atom<boolean>(false);

export const placeTouchedAtom = atom<boolean>(false);
export const dateTouchedAtom = atom<boolean>(false);
export const timeTouchedAtom = atom<boolean>(false);
export const preferenceTouchedAtom = atom<boolean>(false);
