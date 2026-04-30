import type { ToggleSize } from "./types";

export interface ToggleSizeToken {
  height: string;
  paddingX: string;
  fontSize: string;
  borderRadius: string;
}

export const toggleGroupSizeTokens: Record<ToggleSize, ToggleSizeToken> = {
  sm: {
    height: "32px",
    paddingX: "10px",
    fontSize: "13px",
    borderRadius: "6px",
  },
  md: {
    height: "40px",
    paddingX: "14px",
    fontSize: "14px",
    borderRadius: "8px",
  },
  lg: {
    height: "48px",
    paddingX: "18px",
    fontSize: "15px",
    borderRadius: "10px",
  },
};

export const toggleGroupTokens = {
  gap: "0px",
  borderColor: "#d1d5db",
  fontWeight: 500,
  lineHeight: "1.2",
  unselectedBackground: "#ffffff",
  unselectedColor: "#374151",
  unselectedHoverBackground: "#f3f4f6",
  selectedBackground: "#111827",
  selectedColor: "#ffffff",
  selectedHoverBackground: "#1f2937",
  focusRingColor: "#2563eb",
  focusRingWidth: "2px",
  disabledOpacity: 0.5,
} as const;
