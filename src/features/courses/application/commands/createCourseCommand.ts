"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { createCourse } from "../../infrastructure/api/courseApi";
import {
  dateAtom,
  formStatusAtom,
  placeAtom,
  preferenceAtom,
  submissionErrorAtom,
  submitAttemptedAtom,
  timeEndAtom,
  timeStartAtom,
  transportAtom,
} from "../atoms/courseFormAtoms";
import { canSubmitAtom } from "../selectors/courseFormSelectors";

export function useCreateCourseCommand() {
  const place = useAtomValue(placeAtom);
  const date = useAtomValue(dateAtom);
  const timeStart = useAtomValue(timeStartAtom);
  const timeEnd = useAtomValue(timeEndAtom);
  const preference = useAtomValue(preferenceAtom);
  const transport = useAtomValue(transportAtom);
  const canSubmit = useAtomValue(canSubmitAtom);

  const setStatus = useSetAtom(formStatusAtom);
  const setError = useSetAtom(submissionErrorAtom);
  const setSubmitAttempted = useSetAtom(submitAttemptedAtom);

  return useCallback(async () => {
    setSubmitAttempted(true);
    if (!canSubmit) return;

    const time =
      timeStart != null && timeEnd != null
        ? { start: timeStart, end: timeEnd }
        : null;

    setStatus("SUBMITTING");
    setError(null);

    try {
      await createCourse({ place, date, time, preference, transport });
      setStatus("SUBMITTED");
    } catch (e) {
      setStatus("ERROR");
      setError(e instanceof Error ? e.message : "코스 생성에 실패했습니다.");
    }
  }, [
    canSubmit,
    place,
    date,
    timeStart,
    timeEnd,
    preference,
    transport,
    setStatus,
    setError,
    setSubmitAttempted,
  ]);
}
