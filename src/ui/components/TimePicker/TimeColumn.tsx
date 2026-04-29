"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { timePickerTokens as t } from "./tokens";

interface TimeColumnProps<T extends string | number> {
  ariaLabel: string;
  options: T[];
  value: T | null;
  isOptionDisabled?: (option: T) => boolean;
  formatOption?: (option: T) => string;
  onChange: (option: T) => void;
  pageSize?: number;
}

export function TimeColumn<T extends string | number>({
  ariaLabel,
  options,
  value,
  isOptionDisabled,
  formatOption,
  onChange,
  pageSize = 5,
}: TimeColumnProps<T>) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<T, HTMLDivElement | null>>(new Map());

  const enabledOptions = useMemo(
    () => options.filter((o) => !isOptionDisabled?.(o)),
    [options, isOptionDisabled],
  );

  const activeIndex = useMemo(() => {
    if (value == null) return enabledOptions.length > 0 ? 0 : -1;
    const idx = options.indexOf(value);
    return idx >= 0 ? idx : 0;
  }, [value, options, enabledOptions]);

  useEffect(() => {
    if (value == null) return;
    const node = itemRefs.current.get(value);
    if (node && listRef.current) {
      const list = listRef.current;
      const top = node.offsetTop;
      const bottom = top + node.offsetHeight;
      if (top < list.scrollTop || bottom > list.scrollTop + list.clientHeight) {
        node.scrollIntoView({ block: "nearest" });
      }
    }
  }, [value]);

  const moveByDelta = (delta: number) => {
    if (options.length === 0) return;
    let idx = activeIndex;
    for (let i = 0; i < options.length; i++) {
      idx = (idx + delta + options.length) % options.length;
      if (!isOptionDisabled?.(options[idx])) {
        onChange(options[idx]);
        return;
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;
    if (key === "ArrowDown") {
      e.preventDefault();
      moveByDelta(1);
      return;
    }
    if (key === "ArrowUp") {
      e.preventDefault();
      moveByDelta(-1);
      return;
    }
    if (key === "PageDown") {
      e.preventDefault();
      moveByDelta(pageSize);
      return;
    }
    if (key === "PageUp") {
      e.preventDefault();
      moveByDelta(-pageSize);
      return;
    }
    if (key === "Home") {
      e.preventDefault();
      const first = options.findIndex((o) => !isOptionDisabled?.(o));
      if (first >= 0) onChange(options[first]);
      return;
    }
    if (key === "End") {
      e.preventDefault();
      for (let i = options.length - 1; i >= 0; i--) {
        if (!isOptionDisabled?.(options[i])) {
          onChange(options[i]);
          return;
        }
      }
    }
  };

  const listStyle: CSSProperties = {
    width: t.columnWidth,
    height: t.columnHeight,
    overflowY: "auto",
    padding: t.columnPadding,
    outline: "none",
    scrollbarWidth: "thin",
    boxSizing: "border-box",
  };

  const itemStyle = (selected: boolean, disabled: boolean): CSSProperties => ({
    height: t.cellHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: t.cellFontSize,
    borderRadius: t.cellRadius,
    background: selected ? t.cellSelectedBackground : "transparent",
    color: disabled
      ? t.cellDisabledColor
      : selected
        ? t.cellSelectedColor
        : t.cellColor,
    cursor: disabled ? t.cellDisabledCursor : "pointer",
    userSelect: "none",
  });

  const setItemRef = (option: T) => (node: HTMLDivElement | null) => {
    if (node) itemRefs.current.set(option, node);
    else itemRefs.current.delete(option);
  };

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={0}
      style={listStyle}
      onKeyDown={handleKeyDown}
    >
      {options.map((option) => {
        const selected = option === value;
        const disabled = isOptionDisabled?.(option) ?? false;
        const label = formatOption ? formatOption(option) : String(option);
        return (
          <div
            key={String(option)}
            ref={setItemRef(option)}
            role="option"
            aria-selected={selected}
            aria-disabled={disabled || undefined}
            style={itemStyle(selected, disabled)}
            onClick={() => {
              if (!disabled) onChange(option);
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}
