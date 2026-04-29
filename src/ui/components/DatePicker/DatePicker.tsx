"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { Calendar } from "./Calendar";
import { formatDate, isSameDay, startOfDay } from "./dateUtils";
import { datePickerTokens as t } from "./tokens";
import type {
  DatePickerProps,
  DatePickerSelectionMode,
  DateRange,
} from "./types";

type SelectionState = Date | DateRange | Date[] | null;

function isRangeEmpty(r: DateRange): boolean {
  return r.start == null && r.end == null;
}

function applySingle(prev: Date | null, next: Date): Date | null {
  if (prev && isSameDay(prev, next)) return null;
  return startOfDay(next);
}

function applyMultiple(prev: Date[], next: Date): Date[] {
  const exists = prev.some((d) => isSameDay(d, next));
  if (exists) return prev.filter((d) => !isSameDay(d, next));
  return [...prev, startOfDay(next)];
}

function applyRange(prev: DateRange, next: Date): DateRange {
  const day = startOfDay(next);
  if (isRangeEmpty(prev) || (prev.start && prev.end)) {
    return { start: day, end: null };
  }
  if (prev.start && !prev.end) {
    if (day.getTime() < prev.start.getTime()) {
      return { start: day, end: prev.start };
    }
    return { start: prev.start, end: day };
  }
  return { start: day, end: null };
}

function formatTriggerText(
  mode: DatePickerSelectionMode,
  selection: SelectionState,
  locale?: string,
): string {
  if (mode === "single") {
    const v = selection as Date | null;
    return v ? formatDate(v, locale) : "";
  }
  if (mode === "range") {
    const r = selection as DateRange;
    if (!r.start && !r.end) return "";
    const a = r.start ? formatDate(r.start, locale) : "…";
    const b = r.end ? formatDate(r.end, locale) : "…";
    return `${a} ~ ${b}`;
  }
  const arr = selection as Date[];
  if (!arr.length) return "";
  return arr
    .slice()
    .sort((x, y) => x.getTime() - y.getTime())
    .map((d) => formatDate(d, locale))
    .join(", ");
}

export function DatePicker(props: DatePickerProps) {
  const {
    selectionMode,
    displayMode = "popover",
    min,
    max,
    disabledDates,
    locale,
    weekStartsOn = 0,
    placeholder = "Select date",
    ariaLabel,
    disabled = false,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    id,
  } = props;

  const reactId = useId();
  const triggerId = id ?? `datepicker-${reactId}`;
  const popoverId = `${triggerId}-panel`;

  const isControlled = props.value !== undefined;

  const [uncontrolledSelection, setUncontrolledSelection] =
    useState<SelectionState>(() => {
      if (selectionMode === "single") {
        return (props.defaultValue as Date | null | undefined) ?? null;
      }
      if (selectionMode === "range") {
        return (
          (props.defaultValue as DateRange | undefined) ?? {
            start: null,
            end: null,
          }
        );
      }
      return (props.defaultValue as Date[] | undefined) ?? [];
    });

  const selection: SelectionState = (() => {
    if (!isControlled) return uncontrolledSelection;
    if (selectionMode === "single") {
      return (props.value as Date | null | undefined) ?? null;
    }
    if (selectionMode === "range") {
      return (
        (props.value as DateRange | undefined) ?? { start: null, end: null }
      );
    }
    return (props.value as Date[] | undefined) ?? [];
  })();

  const isOpenControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = displayMode === "inline"
    ? true
    : isOpenControlled
      ? (controlledOpen as boolean)
      : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (displayMode === "inline") return;
      if (!isOpenControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [displayMode, isOpenControlled, onOpenChange],
  );

  const handleSelect = useCallback(
    (date: Date) => {
      if (disabled) return;

      if (selectionMode === "single") {
        const prev = selection as Date | null;
        const next = applySingle(prev, date);
        if (!isControlled) setUncontrolledSelection(next);
        (props.onChange as ((v: Date | null) => void) | undefined)?.(next);
        if (displayMode === "popover") setOpen(false);
        return;
      }

      if (selectionMode === "multiple") {
        const prev = selection as Date[];
        const next = applyMultiple(prev, date);
        if (!isControlled) setUncontrolledSelection(next);
        (props.onChange as ((v: Date[]) => void) | undefined)?.(next);
        return;
      }

      const prev = selection as DateRange;
      const next = applyRange(prev, date);
      if (!isControlled) setUncontrolledSelection(next);
      (props.onChange as ((v: DateRange) => void) | undefined)?.(next);
      if (displayMode === "popover" && next.start && next.end) {
        setOpen(false);
      }
    },
    [
      disabled,
      selectionMode,
      selection,
      isControlled,
      displayMode,
      setOpen,
      props,
    ],
  );

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [popoverPos, setPopoverPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const updatePopoverPos = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = popoverRef.current;
    if (!trigger || !panel) return;
    const rect = trigger.getBoundingClientRect();
    const panelHeight = panel.offsetHeight;
    const panelWidth = panel.offsetWidth;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 8;

    let top = rect.bottom + 6;
    if (top + panelHeight > vh - pad) {
      const above = rect.top - panelHeight - 6;
      top = above >= pad ? above : Math.max(pad, vh - panelHeight - pad);
    }

    let left = rect.left;
    if (left + panelWidth > vw - pad) left = vw - panelWidth - pad;
    if (left < pad) left = pad;

    setPopoverPos({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (displayMode !== "popover" || !open) return;
    updatePopoverPos();
  }, [displayMode, open, updatePopoverPos]);

  useEffect(() => {
    if (displayMode !== "popover" || !open) return;
    const handler = () => updatePopoverPos();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [displayMode, open, updatePopoverPos]);

  useEffect(() => {
    if (displayMode !== "popover" || !open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [displayMode, open, setOpen]);

  const triggerText = formatTriggerText(selectionMode, selection, locale);

  const triggerStyle: CSSProperties = {
    height: t.triggerHeight,
    paddingInline: t.triggerPaddingX,
    border: `1px solid ${t.triggerBorderColor}`,
    borderRadius: t.triggerBorderRadius,
    background: disabled ? t.triggerDisabledBackground : t.triggerBackground,
    color: triggerText ? t.triggerColor : t.triggerPlaceholderColor,
    fontSize: "14px",
    textAlign: "left",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    minWidth: "200px",
    width: "100%",
    boxSizing: "border-box",
  };

  const panelStyle: CSSProperties = {
    background: t.panelBackground,
    border: `1px solid ${t.panelBorderColor}`,
    borderRadius: t.panelBorderRadius,
    padding: t.panelPadding,
    boxShadow: t.panelShadow,
    minWidth: t.panelMinWidth,
  };

  const popoverWrapperStyle: CSSProperties = {
    position: "fixed",
    top: popoverPos?.top ?? 0,
    left: popoverPos?.left ?? 0,
    zIndex: t.zIndex,
    visibility: popoverPos ? "visible" : "hidden",
  };

  const calendar = (
    <Calendar
      selectionMode={selectionMode}
      selected={selection}
      onSelect={handleSelect}
      min={min}
      max={max}
      disabledDates={disabledDates}
      locale={locale}
      weekStartsOn={weekStartsOn}
      initialFocus={displayMode === "popover" && open}
      ariaLabel={ariaLabel}
    />
  );

  if (displayMode === "inline") {
    return (
      <div id={triggerId} style={panelStyle}>
        {calendar}
      </div>
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        style={triggerStyle}
        onClick={() => setOpen(!open)}
      >
        {triggerText || placeholder}
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div style={popoverWrapperStyle}>
              <div
                ref={popoverRef}
                id={popoverId}
                role="dialog"
                aria-modal={false}
                aria-label={ariaLabel ?? "Choose date"}
                style={panelStyle}
              >
                {calendar}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
