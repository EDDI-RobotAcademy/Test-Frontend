"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useId } from "react";
import { FieldMessage } from "@/ui/components/FieldMessage";
import { TimePicker } from "@/ui/components/TimePicker";
import {
  timeEndAtom,
  timeEndTouchedAtom,
  timeStartAtom,
  timeStartTouchedAtom,
} from "../../application/atoms/courseFormAtoms";
import {
  showTimeErrorAtom,
  timeErrorAtom,
} from "../../application/selectors/courseFormSelectors";
import { hintMessages } from "../constants/hintMessages";
import { fieldRowStyle, labelRowStyle, labelTextStyle } from "./fieldStyles";
import { TooltipHint } from "./TooltipHint";

export function TimeField() {
  const startId = useId();
  const endId = useId();
  const errorId = `${startId}-error`;

  const [start, setStart] = useAtom(timeStartAtom);
  const [end, setEnd] = useAtom(timeEndAtom);
  const error = useAtomValue(timeErrorAtom);
  const showError = useAtomValue(showTimeErrorAtom) && error != null;

  const setStartTouched = useSetAtom(timeStartTouchedAtom);
  const setEndTouched = useSetAtom(timeEndTouchedAtom);

  return (
    <div style={fieldRowStyle}>
      <div style={labelRowStyle}>
        <span style={labelTextStyle}>시간대</span>
        <TooltipHint message={hintMessages.time} ariaLabel="시간대 도움말" />
      </div>
      <div className="flex items-center gap-2">
        <TimePicker
          id={startId}
          format="24h"
          displayMode="popover"
          value={start}
          onChange={(next) => {
            setStart(next);
            setStartTouched(true);
          }}
          step={{ minute: 5 }}
          ariaLabel="시작 시간"
          placeholder="시작"
          fullWidth
        />
        <span aria-hidden="true" className="text-zinc-400">
          ~
        </span>
        <TimePicker
          id={endId}
          format="24h"
          displayMode="popover"
          value={end}
          onChange={(next) => {
            setEnd(next);
            setEndTouched(true);
          }}
          step={{ minute: 5 }}
          ariaLabel="종료 시간"
          placeholder="종료"
          fullWidth
        />
      </div>
      {showError ? (
        <FieldMessage id={errorId} severity="error">
          {error}
        </FieldMessage>
      ) : null}
    </div>
  );
}
