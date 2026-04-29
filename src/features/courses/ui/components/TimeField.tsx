"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useId } from "react";
import { FieldMessage } from "@/ui/components/FieldMessage";
import { TimePicker } from "@/ui/components/TimePicker";
import {
  timeAtom,
  timeTouchedAtom,
} from "../../application/atoms/courseFormAtoms";
import {
  showTimeErrorAtom,
  timeErrorAtom,
} from "../../application/selectors/courseFormSelectors";
import { hintMessages } from "../constants/hintMessages";
import { fieldRowStyle, labelRowStyle, labelTextStyle } from "./fieldStyles";
import { TooltipHint } from "./TooltipHint";

export function TimeField() {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const [value, setValue] = useAtom(timeAtom);
  const error = useAtomValue(timeErrorAtom);
  const showError = useAtomValue(showTimeErrorAtom) && error != null;
  const setTouched = useSetAtom(timeTouchedAtom);

  return (
    <div style={fieldRowStyle}>
      <div style={labelRowStyle}>
        <span style={labelTextStyle}>시간</span>
        <TooltipHint message={hintMessages.time} ariaLabel="시간 도움말" />
      </div>
      <TimePicker
        id={fieldId}
        format="24h"
        displayMode="popover"
        value={value}
        onChange={(next) => {
          setValue(next);
          setTouched(true);
        }}
        step={{ minute: 5 }}
        ariaLabel="시간"
        placeholder="시간을 선택하세요"
      />
      {showError ? (
        <FieldMessage id={errorId} severity="error">
          {error}
        </FieldMessage>
      ) : null}
    </div>
  );
}
