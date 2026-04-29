"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { TimeColumn } from "./TimeColumn";
import {
  emptyTime,
  formatTime,
  from12Hour,
  getHourOptions,
  getMinuteOptions,
  getSecondOptions,
  getStep,
  pad2,
  to12Hour,
  withinBounds,
} from "./timeUtils";
import { timePickerTokens as t } from "./tokens";
import type {
  TimeFormat,
  TimePeriod,
  TimePickerProps,
  TimeValue,
} from "./types";

export function TimePicker(props: TimePickerProps) {
  const {
    format = "24h",
    displayMode = "popover",
    value: controlledValue,
    defaultValue = null,
    onChange,
    step,
    showSeconds = false,
    min,
    max,
    disabled = false,
    placeholder = "Select time",
    ariaLabel,
    id,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    locale,
  } = props;

  const reactId = useId();
  const triggerId = id ?? `timepicker-${reactId}`;
  const popoverId = `${triggerId}-panel`;

  const isValueControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] =
    useState<TimeValue | null>(defaultValue);
  const value: TimeValue | null = isValueControlled
    ? (controlledValue ?? null)
    : uncontrolledValue;

  const isOpenControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open =
    displayMode === "inline"
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

  const hourStep = getStep(step, "hour");
  const minuteStep = getStep(step, "minute");
  const secondStep = getStep(step, "second");

  const hourOptions = useMemo(
    () => getHourOptions(format, hourStep),
    [format, hourStep],
  );
  const minuteOptions = useMemo(() => getMinuteOptions(minuteStep), [minuteStep]);
  const secondOptions = useMemo(() => getSecondOptions(secondStep), [secondStep]);

  const draft: TimeValue = value ?? emptyTime();

  const updateValue = useCallback(
    (next: TimeValue) => {
      if (!isValueControlled) setUncontrolledValue(next);
      onChange?.(next);
    },
    [isValueControlled, onChange],
  );

  const isHourDisabled = useCallback(
    (hourOption: number) => {
      const candidates: TimeValue[] = [];
      if (format === "24h") {
        candidates.push({ ...draft, hours: hourOption });
      } else {
        const { period } = to12Hour(draft.hours);
        candidates.push({
          ...draft,
          hours: from12Hour(hourOption, period),
        });
      }
      return !candidates.some((c) => withinBounds(c, min, max));
    },
    [format, draft, min, max],
  );

  const isMinuteDisabled = useCallback(
    (minute: number) => !withinBounds({ ...draft, minutes: minute }, min, max),
    [draft, min, max],
  );

  const isSecondDisabled = useCallback(
    (second: number) => !withinBounds({ ...draft, seconds: second }, min, max),
    [draft, min, max],
  );

  const isPeriodDisabled = useCallback(
    (period: TimePeriod) => {
      const { hour12 } = to12Hour(draft.hours);
      const candidate: TimeValue = {
        ...draft,
        hours: from12Hour(hour12, period),
      };
      return !withinBounds(candidate, min, max);
    },
    [draft, min, max],
  );

  const handleHourChange = (hourOption: number) => {
    if (format === "24h") {
      updateValue({ ...draft, hours: hourOption });
      return;
    }
    const { period } = to12Hour(draft.hours);
    updateValue({ ...draft, hours: from12Hour(hourOption, period) });
  };

  const handleMinuteChange = (minute: number) => {
    updateValue({ ...draft, minutes: minute });
  };

  const handleSecondChange = (second: number) => {
    updateValue({ ...draft, seconds: second });
  };

  const handlePeriodChange = (period: TimePeriod) => {
    const { hour12 } = to12Hour(draft.hours);
    updateValue({ ...draft, hours: from12Hour(hour12, period) });
  };

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(
    null,
  );

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

  const triggerText = value
    ? formatTime(value, { format, showSeconds, locale })
    : "";

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
    minWidth: "160px",
    boxSizing: "border-box",
  };

  const panelStyle: CSSProperties = {
    background: t.panelBackground,
    border: `1px solid ${t.panelBorderColor}`,
    borderRadius: t.panelBorderRadius,
    padding: t.panelPadding,
    boxShadow: t.panelShadow,
    display: "inline-flex",
    alignItems: "stretch",
    gap: t.columnGap,
  };

  const separatorStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    color: t.separatorColor,
    fontSize: t.separatorFontSize,
    paddingInline: t.separatorPaddingX,
    fontWeight: 600,
  };

  const popoverWrapperStyle: CSSProperties = {
    position: "fixed",
    top: popoverPos?.top ?? 0,
    left: popoverPos?.left ?? 0,
    zIndex: t.zIndex,
    visibility: popoverPos ? "visible" : "hidden",
  };

  const currentHourValue: number = (() => {
    if (format === "24h") return draft.hours;
    const { hour12 } = to12Hour(draft.hours);
    return hour12;
  })();

  const currentPeriod: TimePeriod = to12Hour(draft.hours).period;

  const panel = (
    <div
      ref={popoverRef}
      id={popoverId}
      role={displayMode === "popover" ? "dialog" : undefined}
      aria-label={ariaLabel ?? "Time picker"}
      style={panelStyle}
    >
      <TimeColumn<number>
        ariaLabel="Hours"
        options={hourOptions}
        value={currentHourValue}
        isOptionDisabled={isHourDisabled}
        formatOption={pad2}
        onChange={handleHourChange}
      />
      <div style={separatorStyle}>:</div>
      <TimeColumn<number>
        ariaLabel="Minutes"
        options={minuteOptions}
        value={draft.minutes}
        isOptionDisabled={isMinuteDisabled}
        formatOption={pad2}
        onChange={handleMinuteChange}
      />
      {showSeconds ? (
        <>
          <div style={separatorStyle}>:</div>
          <TimeColumn<number>
            ariaLabel="Seconds"
            options={secondOptions}
            value={draft.seconds}
            isOptionDisabled={isSecondDisabled}
            formatOption={pad2}
            onChange={handleSecondChange}
          />
        </>
      ) : null}
      {format === "12h" ? (
        <TimeColumn<TimePeriod>
          ariaLabel="Period"
          options={["AM", "PM"]}
          value={currentPeriod}
          isOptionDisabled={isPeriodDisabled}
          onChange={handlePeriodChange}
        />
      ) : null}
    </div>
  );

  if (displayMode === "inline") {
    return <div id={triggerId}>{panel}</div>;
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
        ? createPortal(<div style={popoverWrapperStyle}>{panel}</div>, document.body)
        : null}
    </>
  );
}

export type { TimeFormat };
