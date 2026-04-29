"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  addDays,
  addMonths,
  addYears,
  buildMonthGrid,
  formatDateLong,
  formatMonthYear,
  formatWeekday,
  isAfterDay,
  isBeforeDay,
  isDateDisabled,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "./dateUtils";
import { datePickerTokens as t } from "./tokens";
import type {
  DatePickerSelectionMode,
  DateRange,
  DayCellState,
  DisabledDatesProp,
} from "./types";

interface CalendarProps {
  selectionMode: DatePickerSelectionMode;
  selected: Date | DateRange | Date[] | null;
  onSelect: (date: Date) => void;
  min?: Date;
  max?: Date;
  disabledDates?: DisabledDatesProp;
  locale?: string;
  weekStartsOn: 0 | 1;
  initialFocus?: boolean;
  ariaLabel?: string;
}

function isSelectedDate(
  date: Date,
  mode: DatePickerSelectionMode,
  selected: Date | DateRange | Date[] | null,
): boolean {
  if (selected == null) return false;
  if (mode === "single") return isSameDay(date, selected as Date);
  if (mode === "multiple")
    return (selected as Date[]).some((d) => isSameDay(d, date));
  const range = selected as DateRange;
  return (
    (range.start != null && isSameDay(range.start, date)) ||
    (range.end != null && isSameDay(range.end, date))
  );
}

function getRangeFlags(
  date: Date,
  mode: DatePickerSelectionMode,
  selected: Date | DateRange | Date[] | null,
): { isStart: boolean; isEnd: boolean; isInside: boolean } {
  if (mode !== "range" || selected == null) {
    return { isStart: false, isEnd: false, isInside: false };
  }
  const range = selected as DateRange;
  const isStart = range.start != null && isSameDay(range.start, date);
  const isEnd = range.end != null && isSameDay(range.end, date);
  const isInside =
    range.start != null &&
    range.end != null &&
    isAfterDay(date, range.start) &&
    isBeforeDay(date, range.end);
  return { isStart, isEnd, isInside };
}

export function Calendar({
  selectionMode,
  selected,
  onSelect,
  min,
  max,
  disabledDates,
  locale,
  weekStartsOn,
  initialFocus = false,
  ariaLabel,
}: CalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const initialAnchor = useMemo(() => {
    if (selectionMode === "single" && selected) return selected as Date;
    if (
      selectionMode === "range" &&
      (selected as DateRange | null)?.start
    ) {
      return (selected as DateRange).start as Date;
    }
    if (
      selectionMode === "multiple" &&
      (selected as Date[] | null)?.length
    ) {
      return (selected as Date[])[0];
    }
    return today;
  }, [selectionMode, selected, today]);

  const [monthAnchor, setMonthAnchor] = useState<Date>(
    startOfMonth(initialAnchor),
  );
  const [focusDate, setFocusDate] = useState<Date>(startOfDay(initialAnchor));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const focusedCellRef = useRef<HTMLButtonElement | null>(null);
  const didInitialFocusRef = useRef(false);

  useEffect(() => {
    if (!initialFocus || didInitialFocusRef.current) return;
    if (focusedCellRef.current) {
      focusedCellRef.current.focus();
      didInitialFocusRef.current = true;
    }
  }, [initialFocus]);

  const moveFocus = useCallback(
    (next: Date) => {
      const clamped = (() => {
        if (min && isBeforeDay(next, min)) return startOfDay(min);
        if (max && isAfterDay(next, max)) return startOfDay(max);
        return startOfDay(next);
      })();
      setFocusDate(clamped);
      const ms = startOfMonth(clamped).getTime();
      if (ms !== monthAnchor.getTime()) {
        setMonthAnchor(startOfMonth(clamped));
      }
      requestAnimationFrame(() => {
        focusedCellRef.current?.focus();
      });
    },
    [min, max, monthAnchor],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const { key, shiftKey } = e;
    if (key === "ArrowLeft") {
      e.preventDefault();
      moveFocus(addDays(focusDate, -1));
      return;
    }
    if (key === "ArrowRight") {
      e.preventDefault();
      moveFocus(addDays(focusDate, 1));
      return;
    }
    if (key === "ArrowUp") {
      e.preventDefault();
      moveFocus(addDays(focusDate, -7));
      return;
    }
    if (key === "ArrowDown") {
      e.preventDefault();
      moveFocus(addDays(focusDate, 7));
      return;
    }
    if (key === "Home") {
      e.preventDefault();
      moveFocus(startOfWeek(focusDate, weekStartsOn));
      return;
    }
    if (key === "End") {
      e.preventDefault();
      moveFocus(addDays(startOfWeek(focusDate, weekStartsOn), 6));
      return;
    }
    if (key === "PageUp") {
      e.preventDefault();
      moveFocus(shiftKey ? addYears(focusDate, -1) : addMonths(focusDate, -1));
      return;
    }
    if (key === "PageDown") {
      e.preventDefault();
      moveFocus(shiftKey ? addYears(focusDate, 1) : addMonths(focusDate, 1));
      return;
    }
    if (key === " " || key === "Enter") {
      e.preventDefault();
      if (!isDateDisabled(focusDate, { min, max, disabledDates })) {
        onSelect(focusDate);
      }
    }
  };

  const days: DayCellState[] = useMemo(() => {
    const grid = buildMonthGrid(monthAnchor, weekStartsOn);
    return grid.map((d) => {
      const inMonth = d.getMonth() === monthAnchor.getMonth();
      const disabled = isDateDisabled(d, { min, max, disabledDates });
      const isSelected = isSelectedDate(d, selectionMode, selected);
      const { isStart, isEnd, isInside } = getRangeFlags(
        d,
        selectionMode,
        selected,
      );
      return {
        date: d,
        inMonth,
        isToday: isSameDay(d, today),
        isSelected,
        isRangeStart: isStart,
        isRangeEnd: isEnd,
        isInRange: isInside,
        isDisabled: disabled,
      };
    });
  }, [
    monthAnchor,
    weekStartsOn,
    selectionMode,
    selected,
    min,
    max,
    disabledDates,
    today,
  ]);

  const weekdayLabels = useMemo(() => {
    const labels: { short: string; long: string }[] = [];
    const reference = startOfWeek(today, weekStartsOn);
    for (let i = 0; i < 7; i++) {
      const d = addDays(reference, i);
      labels.push({
        short: formatWeekday(d, locale, "short"),
        long: formatWeekday(d, locale, "short"),
      });
    }
    return labels;
  }, [today, weekStartsOn, locale]);

  const headerLabel = formatMonthYear(monthAnchor, locale);

  const navButtonStyle: CSSProperties = {
    width: t.navButtonSize,
    height: t.navButtonSize,
    border: "none",
    borderRadius: "6px",
    background: "transparent",
    color: t.navButtonColor,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    lineHeight: 1,
  };

  const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  };

  const titleStyle: CSSProperties = {
    color: t.headerColor,
    fontSize: t.headerFontSize,
    fontWeight: t.headerFontWeight,
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "2px",
  };

  const weekdayCellStyle: CSSProperties = {
    color: t.weekdayColor,
    fontSize: t.weekdayFontSize,
    fontWeight: t.weekdayFontWeight,
    height: t.cellSize,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label={ariaLabel ?? "Date picker calendar"}
      onKeyDown={handleKeyDown}
    >
      <div style={headerStyle}>
        <button
          type="button"
          aria-label="Previous month"
          style={navButtonStyle}
          onClick={() => setMonthAnchor((m) => addMonths(m, -1))}
        >
          {"‹"}
        </button>
        <div aria-live="polite" style={titleStyle}>
          {headerLabel}
        </div>
        <button
          type="button"
          aria-label="Next month"
          style={navButtonStyle}
          onClick={() => setMonthAnchor((m) => addMonths(m, 1))}
        >
          {"›"}
        </button>
      </div>

      <div role="grid" aria-label={headerLabel} style={gridStyle}>
        {weekdayLabels.map((w, i) => (
          <div
            key={`wd-${i}`}
            role="columnheader"
            aria-label={w.long}
            style={weekdayCellStyle}
          >
            {w.short}
          </div>
        ))}

        {days.map((cell) => {
          const focused = isSameDay(cell.date, focusDate);
          const isEndpoint = cell.isRangeStart || cell.isRangeEnd;
          const showSelected =
            selectionMode === "range"
              ? isEndpoint
              : cell.isSelected;

          const cellBackground = (() => {
            if (cell.isDisabled) return t.cellDisabledBackground;
            if (showSelected) return t.cellSelectedBackground;
            if (cell.isInRange) return t.cellRangeBackground;
            return "transparent";
          })();

          const cellColor = (() => {
            if (cell.isDisabled) return t.cellDisabledColor;
            if (showSelected) return t.cellSelectedColor;
            if (!cell.inMonth) return t.cellMutedColor;
            return t.cellColor;
          })();

          const cellStyle: CSSProperties = {
            width: t.cellSize,
            height: t.cellSize,
            border: cell.isToday
              ? `1px solid ${t.cellTodayBorderColor}`
              : "1px solid transparent",
            borderRadius: t.cellRadius,
            background: cellBackground,
            color: cellColor,
            fontSize: t.cellFontSize,
            cursor: cell.isDisabled ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            outlineOffset: "-2px",
          };

          return (
            <button
              key={cell.date.toISOString()}
              ref={focused ? focusedCellRef : undefined}
              type="button"
              role="gridcell"
              aria-label={formatDateLong(cell.date, locale)}
              aria-selected={cell.isSelected || undefined}
              aria-disabled={cell.isDisabled || undefined}
              data-today={cell.isToday || undefined}
              data-outside={!cell.inMonth || undefined}
              data-range-start={cell.isRangeStart || undefined}
              data-range-end={cell.isRangeEnd || undefined}
              data-in-range={cell.isInRange || undefined}
              tabIndex={focused ? 0 : -1}
              disabled={cell.isDisabled}
              style={cellStyle}
              onClick={() => {
                setFocusDate(cell.date);
                onSelect(cell.date);
              }}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
