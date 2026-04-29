import type { ButtonSize, ButtonVariant } from "./types";

export interface ButtonSizeToken {
  height: string;
  paddingX: string;
  fontSize: string;
  borderRadius: string;
  iconSize: string;
  gap: string;
  spinnerSize: string;
}

export interface ButtonVariantToken {
  background: string;
  color: string;
  border: string;
  hoverBackground: string;
  activeBackground: string;
  disabledBackground: string;
  disabledColor: string;
  disabledBorder: string;
  focusRingColor: string;
}

export const buttonSizeTokens: Record<ButtonSize, ButtonSizeToken> = {
  sm: {
    height: "32px",
    paddingX: "10px",
    fontSize: "13px",
    borderRadius: "6px",
    iconSize: "14px",
    gap: "6px",
    spinnerSize: "14px",
  },
  md: {
    height: "40px",
    paddingX: "14px",
    fontSize: "14px",
    borderRadius: "8px",
    iconSize: "16px",
    gap: "8px",
    spinnerSize: "16px",
  },
  lg: {
    height: "48px",
    paddingX: "18px",
    fontSize: "15px",
    borderRadius: "10px",
    iconSize: "18px",
    gap: "10px",
    spinnerSize: "18px",
  },
};

export const buttonVariantTokens: Record<ButtonVariant, ButtonVariantToken> = {
  primary: {
    background: "#111827",
    color: "#ffffff",
    border: "1px solid transparent",
    hoverBackground: "#1f2937",
    activeBackground: "#0f172a",
    disabledBackground: "#9ca3af",
    disabledColor: "#f3f4f6",
    disabledBorder: "1px solid transparent",
    focusRingColor: "rgba(17, 24, 39, 0.3)",
  },
  secondary: {
    background: "#ffffff",
    color: "#111827",
    border: "1px solid #d1d5db",
    hoverBackground: "#f9fafb",
    activeBackground: "#f3f4f6",
    disabledBackground: "#f3f4f6",
    disabledColor: "#9ca3af",
    disabledBorder: "1px solid #e5e7eb",
    focusRingColor: "rgba(37, 99, 235, 0.25)",
  },
  ghost: {
    background: "transparent",
    color: "#111827",
    border: "1px solid transparent",
    hoverBackground: "#f3f4f6",
    activeBackground: "#e5e7eb",
    disabledBackground: "transparent",
    disabledColor: "#9ca3af",
    disabledBorder: "1px solid transparent",
    focusRingColor: "rgba(17, 24, 39, 0.2)",
  },
  danger: {
    background: "#dc2626",
    color: "#ffffff",
    border: "1px solid transparent",
    hoverBackground: "#b91c1c",
    activeBackground: "#991b1b",
    disabledBackground: "#fca5a5",
    disabledColor: "#ffffff",
    disabledBorder: "1px solid transparent",
    focusRingColor: "rgba(220, 38, 38, 0.3)",
  },
};

export const buttonTokens = {
  fontWeight: 600,
  focusRingWidth: "3px",
  transitionDuration: "120ms",
  loadingOpacity: 0.7,
} as const;
