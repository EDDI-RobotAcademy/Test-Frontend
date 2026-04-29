import type { FieldMessageSeverity } from "./types";

export interface FieldMessageSeverityToken {
  color: string;
  iconColor: string;
  glyph: string;
  ariaLabel: string;
}

export const fieldMessageSeverityTokens: Record<
  FieldMessageSeverity,
  FieldMessageSeverityToken
> = {
  info: {
    color: "#1d4ed8",
    iconColor: "#2563eb",
    glyph: "ⓘ",
    ariaLabel: "Information",
  },
  success: {
    color: "#15803d",
    iconColor: "#16a34a",
    glyph: "✓",
    ariaLabel: "Success",
  },
  warning: {
    color: "#a16207",
    iconColor: "#ca8a04",
    glyph: "⚠",
    ariaLabel: "Warning",
  },
  error: {
    color: "#b91c1c",
    iconColor: "#dc2626",
    glyph: "⊘",
    ariaLabel: "Error",
  },
};

export const fieldMessageTokens = {
  fontSize: "12px",
  lineHeight: 1.4,
  gap: "6px",
  marginTop: "4px",
  iconSize: "14px",
  fontWeight: 500,
} as const;
