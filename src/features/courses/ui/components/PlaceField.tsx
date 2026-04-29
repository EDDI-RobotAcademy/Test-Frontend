"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useId } from "react";
import { FieldMessage } from "@/ui/components/FieldMessage";
import { Input } from "@/ui/components/Input";
import {
  placeAtom,
  placeTouchedAtom,
} from "../../application/atoms/courseFormAtoms";
import {
  placeErrorAtom,
  showPlaceErrorAtom,
} from "../../application/selectors/courseFormSelectors";
import { hintMessages } from "../constants/hintMessages";
import { fieldRowStyle, labelRowStyle, labelTextStyle } from "./fieldStyles";
import { TooltipHint } from "./TooltipHint";

export function PlaceField() {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [value, setValue] = useAtom(placeAtom);
  const error = useAtomValue(placeErrorAtom);
  const showError = useAtomValue(showPlaceErrorAtom) && error != null;
  const setTouched = useSetAtom(placeTouchedAtom);

  return (
    <div style={fieldRowStyle}>
      <div style={labelRowStyle}>
        <label htmlFor={inputId} style={labelTextStyle}>
          장소
        </label>
        <TooltipHint message={hintMessages.place} ariaLabel="장소 도움말" />
      </div>
      <Input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        invalid={showError}
        placeholder="예) 성수동, 서울숲"
        ariaLabel="장소"
        describedBy={showError ? errorId : undefined}
      />
      {showError ? (
        <FieldMessage id={errorId} severity="error">
          {error}
        </FieldMessage>
      ) : null}
    </div>
  );
}
