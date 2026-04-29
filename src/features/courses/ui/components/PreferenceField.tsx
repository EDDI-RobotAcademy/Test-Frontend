"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useId } from "react";
import { FieldMessage } from "@/ui/components/FieldMessage";
import { TextArea } from "@/ui/components/TextArea";
import {
  preferenceAtom,
  preferenceTouchedAtom,
} from "../../application/atoms/courseFormAtoms";
import {
  preferenceErrorAtom,
  showPreferenceErrorAtom,
} from "../../application/selectors/courseFormSelectors";
import { hintMessages } from "../constants/hintMessages";
import { fieldRowStyle, labelRowStyle, labelTextStyle } from "./fieldStyles";
import { TooltipHint } from "./TooltipHint";

const PREFERENCE_MAX_LENGTH = 500;

export function PreferenceField() {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const [value, setValue] = useAtom(preferenceAtom);
  const error = useAtomValue(preferenceErrorAtom);
  const showError = useAtomValue(showPreferenceErrorAtom) && error != null;
  const setTouched = useSetAtom(preferenceTouchedAtom);

  return (
    <div style={fieldRowStyle}>
      <div style={labelRowStyle}>
        <label htmlFor={fieldId} style={labelTextStyle}>
          선호도
        </label>
        <TooltipHint
          message={hintMessages.preference}
          ariaLabel="선호도 도움말"
        />
      </div>
      <TextArea
        id={fieldId}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        maxLength={PREFERENCE_MAX_LENGTH}
        maxLengthBehavior="block"
        autoResize
        rows={3}
        maxRows={8}
        invalid={showError}
        placeholder="선호하는 분위기, 활동, 음식 등을 자유롭게 적어 주세요."
        ariaLabel="선호도"
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
