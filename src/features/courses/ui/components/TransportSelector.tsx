"use client";

import { useAtomValue } from "jotai";
import { FieldMessage } from "@/ui/components/FieldMessage";
import { ToggleButtonGroup } from "@/ui/components/ToggleButtonGroup";
import { transportAtom } from "../../application/atoms/courseFormAtoms";
import { useTransportCommand } from "../../application/commands/transportCommand";
import {
  showTransportErrorAtom,
  transportErrorAtom,
} from "../../application/selectors/courseFormSelectors";
import type { TransportMode } from "../../domain/model/course";
import { hintMessages } from "../constants/hintMessages";
import { fieldRowStyle, labelRowStyle, labelTextStyle } from "./fieldStyles";
import { TooltipHint } from "./TooltipHint";

const transportOptions = [
  { value: "car", label: "자차" },
  { value: "walk", label: "도보" },
];

export function TransportSelector() {
  const value = useAtomValue(transportAtom);
  const error = useAtomValue(transportErrorAtom);
  const showError = useAtomValue(showTransportErrorAtom) && error != null;
  const dispatchTransport = useTransportCommand();

  return (
    <div style={fieldRowStyle}>
      <div style={labelRowStyle}>
        <span style={labelTextStyle}>이동 수단</span>
        <TooltipHint
          message={hintMessages.transport}
          ariaLabel="이동 수단 도움말"
        />
      </div>
      <ToggleButtonGroup
        selectionMode="single"
        ariaLabel="이동 수단"
        options={transportOptions}
        value={value}
        onChange={(next) => dispatchTransport(next as TransportMode | null)}
      />
      {showError ? (
        <FieldMessage severity="error">{error}</FieldMessage>
      ) : null}
    </div>
  );
}
