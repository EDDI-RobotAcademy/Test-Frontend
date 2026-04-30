"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useId, type FormEvent } from "react";
import { useCreateCourseCommand } from "@/features/courses/application/commands/createCourseCommand";
import { useTransportCommand } from "@/features/courses/application/commands/transportCommand";
import {
  dateAtom,
  placeAtom,
  placeTouchedAtom,
  timeEndAtom,
  timeEndTouchedAtom,
  timeStartAtom,
  timeStartTouchedAtom,
  transportAtom,
} from "@/features/courses/application/atoms/courseFormAtoms";
import {
  canSubmitAtom,
  isSubmittingAtom,
  placeErrorAtom,
  showPlaceErrorAtom,
  showTimeErrorAtom,
  showTransportErrorAtom,
  submissionErrorTextAtom,
  timeErrorAtom,
  transportErrorAtom,
} from "@/features/courses/application/selectors/courseFormSelectors";
import type { TransportMode } from "@/features/courses/domain/model/course";
import { hintMessages } from "@/features/courses/ui/constants/hintMessages";
import { TooltipHint } from "@/features/courses/ui/components/TooltipHint";
import {
  CarIcon,
  ClockIcon,
  CompassIcon,
  PlaceIcon,
  SparklesIcon,
  WalkIcon,
} from "@/features/courses/ui/icons";
import { Button } from "@/ui/components/Button";
import { FieldMessage } from "@/ui/components/FieldMessage";
import { Input } from "@/ui/components/Input";
import { TimePicker } from "@/ui/components/TimePicker";
import { ToggleButtonGroup } from "@/ui/components/ToggleButtonGroup";
import {
  useTrackDefaultDateApplied,
  useTrackHomeEntry,
} from "../../application/commands/trackHomeEntry";

const transportOptions = [
  {
    value: "car",
    label: (
      <span className="inline-flex items-center justify-center gap-1.5">
        <CarIcon size={16} aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">자차</span>
      </span>
    ),
  },
  {
    value: "walk",
    label: (
      <span className="inline-flex items-center justify-center gap-1.5">
        <WalkIcon size={16} aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">도보</span>
      </span>
    ),
  },
];

function todayStartOfDay(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function HomeCourseForm() {
  const placeId = useId();
  const timeStartId = useId();
  const timeEndId = useId();
  const transportId = useId();
  const placeErrorId = `${placeId}-error`;
  const timeErrorId = `${timeStartId}-error`;
  const transportErrorId = `${transportId}-error`;

  const [place, setPlace] = useAtom(placeAtom);
  const [timeStart, setTimeStart] = useAtom(timeStartAtom);
  const [timeEnd, setTimeEnd] = useAtom(timeEndAtom);
  const transport = useAtomValue(transportAtom);
  const setPlaceTouched = useSetAtom(placeTouchedAtom);
  const setTimeStartTouched = useSetAtom(timeStartTouchedAtom);
  const setTimeEndTouched = useSetAtom(timeEndTouchedAtom);
  const setDate = useSetAtom(dateAtom);
  const dispatchTransport = useTransportCommand();

  const placeError = useAtomValue(placeErrorAtom);
  const timeError = useAtomValue(timeErrorAtom);
  const transportError = useAtomValue(transportErrorAtom);
  const showPlaceError = useAtomValue(showPlaceErrorAtom) && placeError != null;
  const showTimeError = useAtomValue(showTimeErrorAtom) && timeError != null;
  const showTransportError =
    useAtomValue(showTransportErrorAtom) && transportError != null;

  const canSubmit = useAtomValue(canSubmitAtom);
  const isSubmitting = useAtomValue(isSubmittingAtom);
  const submissionError = useAtomValue(submissionErrorTextAtom);
  const createCourse = useCreateCourseCommand();

  const trackEntry = useTrackHomeEntry();
  const trackDefaultDate = useTrackDefaultDateApplied();

  useEffect(() => {
    trackEntry();
  }, [trackEntry]);

  useEffect(() => {
    setDate((prev) => {
      if (prev != null) return prev;
      trackDefaultDate();
      return todayStartOfDay();
    });
  }, [setDate, trackDefaultDate]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void createCourse();
  };

  return (
    <form
      id="course-form"
      aria-label="코스 생성 폼"
      onSubmit={handleSubmit}
      noValidate
      className="relative mx-auto w-full rounded-[28px] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-[1.5px] shadow-[0_0_50px_-12px_rgba(99,102,241,0.45)] dark:shadow-[0_0_80px_-12px_rgba(99,102,241,0.55)]"
    >
      <div
        className="
          grid gap-x-2 gap-y-3 sm:gap-x-4 md:gap-x-5
          rounded-[26.5px] bg-white p-4 sm:p-6 md:p-7 dark:bg-black
          grid-cols-3
          [grid-template-areas:'place-label_time-label_transport-label''place-input_time-input_transport-input''submit_submit_submit']
        "
      >
        <div className="[grid-area:place-label] flex flex-wrap items-center gap-x-2 gap-y-1">
          <PlaceIcon
            size={16}
            className="shrink-0 text-indigo-500 dark:text-indigo-400"
          />
          <label
            htmlFor={placeId}
            className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
          >
            장소
          </label>
          <TooltipHint message={hintMessages.place} ariaLabel="장소 도움말" />
        </div>
        <div className="[grid-area:time-label] flex flex-wrap items-center gap-x-2 gap-y-1">
          <ClockIcon
            size={16}
            className="shrink-0 text-violet-500 dark:text-violet-400"
          />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            시간대
          </span>
          <TooltipHint message={hintMessages.time} ariaLabel="시간대 도움말" />
        </div>
        <div className="[grid-area:transport-label] flex flex-wrap items-center gap-x-2 gap-y-1">
          <CompassIcon
            size={16}
            className="shrink-0 text-fuchsia-500 dark:text-fuchsia-400"
          />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            이동 방식
          </span>
          <TooltipHint
            message={hintMessages.transport}
            ariaLabel="이동 방식 도움말"
          />
        </div>

        <div className="[grid-area:place-input] flex flex-col gap-1.5">
          <Input
            id={placeId}
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            onBlur={() => setPlaceTouched(true)}
            invalid={showPlaceError}
            placeholder="예) 성수동, 서울숲"
            ariaLabel="장소"
            describedBy={showPlaceError ? placeErrorId : undefined}
          />
          {showPlaceError ? (
            <FieldMessage id={placeErrorId} severity="error">
              {placeError}
            </FieldMessage>
          ) : null}
        </div>
        <div className="[grid-area:time-input] flex flex-col gap-1.5">
          <div className="flex items-center gap-1 sm:gap-2">
            <TimePicker
              id={timeStartId}
              format="24h"
              displayMode="popover"
              value={timeStart}
              onChange={(next) => {
                setTimeStart(next);
                setTimeStartTouched(true);
              }}
              step={{ minute: 5 }}
              ariaLabel="시작 시간"
              placeholder="시작"
              fullWidth
            />
            <span
              aria-hidden="true"
              className="hidden text-zinc-400 sm:inline dark:text-zinc-500"
            >
              ~
            </span>
            <TimePicker
              id={timeEndId}
              format="24h"
              displayMode="popover"
              value={timeEnd}
              onChange={(next) => {
                setTimeEnd(next);
                setTimeEndTouched(true);
              }}
              step={{ minute: 5 }}
              ariaLabel="종료 시간"
              placeholder="종료"
              fullWidth
            />
          </div>
          {showTimeError ? (
            <FieldMessage id={timeErrorId} severity="error">
              {timeError}
            </FieldMessage>
          ) : null}
        </div>
        <div
          id={transportId}
          className="[grid-area:transport-input] flex flex-col gap-1.5"
        >
          <ToggleButtonGroup
            selectionMode="single"
            ariaLabel="이동 방식"
            size="md"
            fullWidth
            options={transportOptions}
            value={transport}
            onChange={(next) => dispatchTransport(next as TransportMode | null)}
          />
          {showTransportError ? (
            <FieldMessage id={transportErrorId} severity="error">
              {transportError}
            </FieldMessage>
          ) : null}
        </div>

        <div className="[grid-area:submit] mt-4 flex flex-col gap-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit && !isSubmitting}
            loading={isSubmitting}
            loadingLabel="코스를 생성하고 있어요"
            leading={<SparklesIcon size={18} />}
          >
            코스 생성
          </Button>
          {submissionError ? (
            <FieldMessage severity="error">{submissionError}</FieldMessage>
          ) : null}
        </div>
      </div>
    </form>
  );
}
