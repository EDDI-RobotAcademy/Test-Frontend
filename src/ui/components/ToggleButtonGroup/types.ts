import type { ReactNode } from "react";

export type ToggleSelectionMode = "single" | "multi";

export type ToggleOrientation = "horizontal" | "vertical";

export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface ToggleButtonGroupBaseProps {
  options: ToggleOption[];
  orientation?: ToggleOrientation;
  disabled?: boolean;
  ariaLabel?: string;
  size?: ToggleSize;
  fullWidth?: boolean;
}

export interface ToggleButtonGroupSingleProps extends ToggleButtonGroupBaseProps {
  selectionMode: "single";
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}

export interface ToggleButtonGroupMultiProps extends ToggleButtonGroupBaseProps {
  selectionMode: "multi";
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

export type ToggleButtonGroupProps =
  | ToggleButtonGroupSingleProps
  | ToggleButtonGroupMultiProps;
