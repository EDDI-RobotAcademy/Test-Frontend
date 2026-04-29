import type { ReactElement, ReactNode } from "react";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export type TooltipTrigger = "hover" | "click" | "focus" | "manual";

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  offset?: number;
  id?: string;
}

export interface TooltipPosition {
  top: number;
  left: number;
  placement: TooltipPlacement;
}
