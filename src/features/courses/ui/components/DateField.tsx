"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useId, useMemo } from "react";
import { DatePicker } from "@/ui/components/DatePicker";
import { FieldMessage } from "@/ui/components/FieldMessage";
import {
  dateAtom,
  dateTouchedAtom,
} from "../../application/atoms/courseFormAtoms";
import {
  dateErrorAtom,
  showDateErrorAtom,
} from "../../application/selectors/courseFormSelectors";
import { hintMessages } from "../constants/hintMessages";
import { fieldRowStyle, labelRowStyle, labelTextStyle } from "./fieldStyles";
import { TooltipHint } from "./TooltipHint";

export function DateField() {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const [value, setValue] = useAtom(dateAtom);
  const error = useAtomValue(dateErrorAtom);
  const showError = useAtomValue(showDateErrorAtom) && error != null;
  const setTouched = useSetAtom(dateTouchedAtom);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  return (
    <div style={fieldRowStyle}>
      <div style={labelRowStyle}>
        <span style={labelTextStyle}>날짜</span>
        <TooltipHint message={hintMessages.date} ariaLabel="날짜 도움말" />
      </div>
      <DatePicker
        id={fieldId}
        selectionMode="single"
        displayMode="popover"
        value={value}
        onChange={(next) => {
          setValue(next);
          setTouched(true);
        }}
        min={today}
        ariaLabel="날짜"
        placeholder="날짜를 선택하세요"
      />
      {showError ? (
        <FieldMessage id={errorId} severity="error">
          {error}
        </FieldMessage>
      ) : null}
    </div>
  );
}
