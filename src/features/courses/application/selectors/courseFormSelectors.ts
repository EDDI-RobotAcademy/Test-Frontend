import { atom } from "jotai";
import {
  dateAtom,
  dateTouchedAtom,
  formStatusAtom,
  placeAtom,
  placeTouchedAtom,
  preferenceAtom,
  preferenceTouchedAtom,
  submissionErrorAtom,
  submitAttemptedAtom,
  timeAtom,
  timeTouchedAtom,
  transportAtom,
} from "../atoms/courseFormAtoms";

const PREFERENCE_MAX_LENGTH = 500;

export const placeErrorAtom = atom<string | null>((get) => {
  if (get(placeAtom).trim().length === 0) return "장소를 입력해 주세요";
  return null;
});

export const dateErrorAtom = atom<string | null>((get) => {
  if (get(dateAtom) == null) return "날짜를 선택해 주세요";
  return null;
});

export const timeErrorAtom = atom<string | null>((get) => {
  if (get(timeAtom) == null) return "시간을 선택해 주세요";
  return null;
});

export const preferenceErrorAtom = atom<string | null>((get) => {
  const v = get(preferenceAtom);
  if (v.length > PREFERENCE_MAX_LENGTH) {
    return `${PREFERENCE_MAX_LENGTH}자 이내로 입력해 주세요`;
  }
  return null;
});

export const transportErrorAtom = atom<string | null>((get) => {
  if (get(transportAtom) == null) return "이동 수단을 선택해 주세요";
  return null;
});

export const isSubmittingAtom = atom<boolean>(
  (get) => get(formStatusAtom) === "SUBMITTING",
);

export const submissionErrorTextAtom = atom<string | null>((get) =>
  get(submissionErrorAtom),
);

export const canSubmitAtom = atom<boolean>((get) => {
  if (get(isSubmittingAtom)) return false;
  return (
    get(placeErrorAtom) == null &&
    get(dateErrorAtom) == null &&
    get(timeErrorAtom) == null &&
    get(preferenceErrorAtom) == null &&
    get(transportErrorAtom) == null
  );
});

export const showPlaceErrorAtom = atom<boolean>(
  (get) => get(submitAttemptedAtom) || get(placeTouchedAtom),
);

export const showDateErrorAtom = atom<boolean>(
  (get) => get(submitAttemptedAtom) || get(dateTouchedAtom),
);

export const showTimeErrorAtom = atom<boolean>(
  (get) => get(submitAttemptedAtom) || get(timeTouchedAtom),
);

export const showPreferenceErrorAtom = atom<boolean>(
  (get) => get(submitAttemptedAtom) || get(preferenceTouchedAtom),
);

export const showTransportErrorAtom = atom<boolean>(
  (get) => get(submitAttemptedAtom),
);
