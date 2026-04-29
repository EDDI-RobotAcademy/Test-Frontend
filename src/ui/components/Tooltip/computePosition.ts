import { tooltipTokens } from "./tokens";
import type { TooltipPlacement, TooltipPosition } from "./types";

interface ComputePositionArgs {
  triggerRect: DOMRect;
  tooltipRect: { width: number; height: number };
  viewport: { width: number; height: number };
  placement: TooltipPlacement;
  offset: number;
}

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function placeAt(
  placement: TooltipPlacement,
  triggerRect: DOMRect,
  tooltipRect: { width: number; height: number },
  offset: number,
): { top: number; left: number } {
  switch (placement) {
    case "top":
      return {
        top: triggerRect.top - tooltipRect.height - offset,
        left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
      };
    case "bottom":
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
      };
    case "left":
      return {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.left - tooltipRect.width - offset,
      };
    case "right":
      return {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.right + offset,
      };
  }
}

function fits(
  pos: { top: number; left: number },
  tooltipRect: { width: number; height: number },
  viewport: { width: number; height: number },
  pad: number,
): boolean {
  return (
    pos.top >= pad &&
    pos.left >= pad &&
    pos.top + tooltipRect.height <= viewport.height - pad &&
    pos.left + tooltipRect.width <= viewport.width - pad
  );
}

function clamp(
  pos: { top: number; left: number },
  tooltipRect: { width: number; height: number },
  viewport: { width: number; height: number },
  pad: number,
): { top: number; left: number } {
  return {
    top: Math.max(
      pad,
      Math.min(pos.top, viewport.height - tooltipRect.height - pad),
    ),
    left: Math.max(
      pad,
      Math.min(pos.left, viewport.width - tooltipRect.width - pad),
    ),
  };
}

export function computePosition({
  triggerRect,
  tooltipRect,
  viewport,
  placement,
  offset,
}: ComputePositionArgs): TooltipPosition {
  const pad = tooltipTokens.viewportPadding;

  const primary = placeAt(placement, triggerRect, tooltipRect, offset);
  if (fits(primary, tooltipRect, viewport, pad)) {
    return { ...primary, placement };
  }

  const flipped = OPPOSITE[placement];
  const fallback = placeAt(flipped, triggerRect, tooltipRect, offset);
  if (fits(fallback, tooltipRect, viewport, pad)) {
    return { ...fallback, placement: flipped };
  }

  const clamped = clamp(primary, tooltipRect, viewport, pad);
  return { ...clamped, placement };
}
