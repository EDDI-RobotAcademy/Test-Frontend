"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";
import { computePosition } from "./computePosition";
import { tooltipTokens } from "./tokens";
import type { TooltipPosition, TooltipProps } from "./types";

type AnyHandler = (e: SyntheticEvent<HTMLElement>) => void;

interface TriggerInjectedProps {
  ref: (node: HTMLElement | null) => void;
  onMouseEnter?: AnyHandler;
  onMouseLeave?: AnyHandler;
  onFocus?: AnyHandler;
  onBlur?: AnyHandler;
  onClick?: AnyHandler;
  "aria-describedby"?: string;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  trigger = "hover",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  offset = tooltipTokens.offset,
  id,
}: TooltipProps) {
  const generatedId = useId();
  const tooltipId = id ?? `tooltip-${generatedId}`;

  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    placement,
  });

  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    const tooltipEl = tooltipRef.current;
    if (!triggerEl || !tooltipEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const tooltipRect = {
      width: tooltipEl.offsetWidth,
      height: tooltipEl.offsetHeight,
    };
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    setPosition(
      computePosition({
        triggerRect,
        tooltipRect,
        viewport,
        placement,
        offset,
      }),
    );
  }, [placement, offset]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, content, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handler = () => updatePosition();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open, updatePosition]);

  const triggerHandlers = useMemo<Partial<TriggerInjectedProps>>(() => {
    if (trigger === "manual") return {};

    if (trigger === "hover") {
      return {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
      };
    }

    if (trigger === "focus") {
      return {
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
      };
    }

    return {
      onClick: () => setOpen(!open),
    };
  }, [trigger, open, setOpen]);

  if (!isValidElement(children)) {
    throw new Error("Tooltip children must be a single React element");
  }

  const childProps = children.props as Record<string, unknown>;

  const mergedHandlers: Partial<TriggerInjectedProps> = {};
  (
    ["onMouseEnter", "onMouseLeave", "onFocus", "onBlur", "onClick"] as const
  ).forEach((evt) => {
    const injected = triggerHandlers[evt];
    const original = childProps[evt] as AnyHandler | undefined;
    if (!injected && !original) return;
    mergedHandlers[evt] = (e: SyntheticEvent<HTMLElement>) => {
      original?.(e);
      injected?.(e);
    };
  });

  const triggerElement = cloneElement<TriggerInjectedProps>(
    children as ReactElement<TriggerInjectedProps>,
    // eslint-disable-next-line react-hooks/refs
    {
      ref: setTriggerRef,
      "aria-describedby": open ? tooltipId : undefined,
      ...mergedHandlers,
    },
  );

  const tooltipStyle: CSSProperties = {
    position: "fixed",
    top: position.top,
    left: position.left,
    background: tooltipTokens.background,
    color: tooltipTokens.color,
    fontSize: tooltipTokens.fontSize,
    lineHeight: tooltipTokens.lineHeight,
    padding: `${tooltipTokens.paddingY} ${tooltipTokens.paddingX}`,
    borderRadius: tooltipTokens.borderRadius,
    boxShadow: tooltipTokens.boxShadow,
    maxWidth: tooltipTokens.maxWidth,
    zIndex: tooltipTokens.zIndex,
    pointerEvents: "none",
    width: "max-content",
  };

  const tooltipNode = (
    <div
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      data-placement={position.placement}
      style={tooltipStyle}
    >
      {content}
    </div>
  );

  return (
    <>
      {triggerElement}
      {open && typeof document !== "undefined"
        ? createPortal(tooltipNode, document.body)
        : null}
    </>
  );
}
