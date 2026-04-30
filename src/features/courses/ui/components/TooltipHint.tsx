"use client";

import type { CSSProperties } from "react";
import { Tooltip } from "@/ui/components/Tooltip";

interface TooltipHintProps {
  message: string;
  ariaLabel?: string;
}

const buttonStyle: CSSProperties = {
  width: "20px",
  height: "20px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  padding: 0,
  lineHeight: 1,
};

export function TooltipHint({ message, ariaLabel = "도움말" }: TooltipHintProps) {
  return (
    <Tooltip trigger="hover" placement="top" content={message}>
      <button type="button" aria-label={ariaLabel} style={buttonStyle}>
        ?
      </button>
    </Tooltip>
  );
}
