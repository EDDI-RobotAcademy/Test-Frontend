"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { toggleGroupSizeTokens, toggleGroupTokens } from "./tokens";
import type {
  ToggleButtonGroupProps,
  ToggleOption,
  ToggleOrientation,
} from "./types";

function getNextEnabledIndex(
  options: ToggleOption[],
  from: number,
  step: 1 | -1,
): number {
  const len = options.length;
  if (len === 0) return -1;
  let idx = from;
  for (let i = 0; i < len; i++) {
    idx = (idx + step + len) % len;
    if (!options[idx].disabled) return idx;
  }
  return -1;
}

function findFirstEnabledIndex(options: ToggleOption[]): number {
  return options.findIndex((o) => !o.disabled);
}

function findLastEnabledIndex(options: ToggleOption[]): number {
  for (let i = options.length - 1; i >= 0; i--) {
    if (!options[i].disabled) return i;
  }
  return -1;
}

function isPrevKey(key: string, orientation: ToggleOrientation): boolean {
  return orientation === "horizontal" ? key === "ArrowLeft" : key === "ArrowUp";
}

function isNextKey(key: string, orientation: ToggleOrientation): boolean {
  return orientation === "horizontal" ? key === "ArrowRight" : key === "ArrowDown";
}

export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  const {
    options,
    orientation = "horizontal",
    disabled: groupDisabled = false,
    ariaLabel,
    selectionMode,
    size = "md",
    fullWidth = false,
  } = props;

  const sizeToken = toggleGroupSizeTokens[size];

  const isControlled = props.value !== undefined;

  const [uncontrolledSingle, setUncontrolledSingle] = useState<string | null>(
    selectionMode === "single"
      ? (props.defaultValue ?? null)
      : null,
  );
  const [uncontrolledMulti, setUncontrolledMulti] = useState<string[]>(
    selectionMode === "multi" ? (props.defaultValue ?? []) : [],
  );

  const propsValue = props.value;

  const currentSingle = useMemo<string | null>(() => {
    if (selectionMode !== "single") return null;
    if (isControlled) return (propsValue as string | null | undefined) ?? null;
    return uncontrolledSingle;
  }, [selectionMode, isControlled, propsValue, uncontrolledSingle]);

  const currentMulti = useMemo<string[]>(() => {
    if (selectionMode !== "multi") return [];
    if (isControlled) return (propsValue as string[] | undefined) ?? [];
    return uncontrolledMulti;
  }, [selectionMode, isControlled, propsValue, uncontrolledMulti]);

  const isSelected = useCallback(
    (value: string) => {
      if (selectionMode === "single") return currentSingle === value;
      return currentMulti.includes(value);
    },
    [selectionMode, currentSingle, currentMulti],
  );

  const initialFocusIndex = useMemo(() => {
    const selectedIdx = options.findIndex(
      (o) => !o.disabled && isSelected(o.value),
    );
    if (selectedIdx >= 0) return selectedIdx;
    return findFirstEnabledIndex(options);
  }, [options, isSelected]);

  const [focusIndex, setFocusIndex] = useState<number>(initialFocusIndex);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const setItemRef = useCallback(
    (index: number) => (node: HTMLButtonElement | null) => {
      itemRefs.current[index] = node;
    },
    [],
  );

  const focusIndexAt = useCallback((index: number) => {
    const node = itemRefs.current[index];
    if (node) node.focus();
    setFocusIndex(index);
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      if (selectionMode === "single") {
        const next = currentSingle === value ? null : value;
        if (!isControlled) setUncontrolledSingle(next);
        props.onChange?.(next);
        return;
      }

      const next = currentMulti.includes(value)
        ? currentMulti.filter((v) => v !== value)
        : [...currentMulti, value];
      if (!isControlled) setUncontrolledMulti(next);
      props.onChange?.(next);
    },
    [selectionMode, isControlled, currentSingle, currentMulti, props],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const { key } = e;

      if (isPrevKey(key, orientation)) {
        e.preventDefault();
        const next = getNextEnabledIndex(options, index, -1);
        if (next >= 0) focusIndexAt(next);
        return;
      }

      if (isNextKey(key, orientation)) {
        e.preventDefault();
        const next = getNextEnabledIndex(options, index, 1);
        if (next >= 0) focusIndexAt(next);
        return;
      }

      if (key === "Home") {
        e.preventDefault();
        const next = findFirstEnabledIndex(options);
        if (next >= 0) focusIndexAt(next);
        return;
      }

      if (key === "End") {
        e.preventDefault();
        const next = findLastEnabledIndex(options);
        if (next >= 0) focusIndexAt(next);
        return;
      }

      if (key === " " || key === "Enter") {
        e.preventDefault();
        handleSelect(options[index].value);
      }
    },
    [orientation, options, focusIndexAt, handleSelect],
  );

  const containerStyle: CSSProperties = {
    display: fullWidth ? "flex" : "inline-flex",
    width: fullWidth ? "100%" : undefined,
    flexDirection: orientation === "horizontal" ? "row" : "column",
    gap: toggleGroupTokens.gap,
    border: `1px solid ${toggleGroupTokens.borderColor}`,
    borderRadius: sizeToken.borderRadius,
    overflow: "hidden",
    opacity: groupDisabled ? toggleGroupTokens.disabledOpacity : 1,
    boxSizing: "border-box",
  };

  const baseButtonStyle: CSSProperties = {
    appearance: "none",
    border: "none",
    margin: 0,
    paddingBlock: 0,
    paddingInline: sizeToken.paddingX,
    height: orientation === "horizontal" ? sizeToken.height : undefined,
    minHeight:
      orientation === "vertical" ? sizeToken.height : undefined,
    fontSize: sizeToken.fontSize,
    fontWeight: toggleGroupTokens.fontWeight,
    lineHeight: toggleGroupTokens.lineHeight,
    cursor: "pointer",
    transition: "background-color 120ms ease, color 120ms ease",
    outlineOffset: "-2px",
    flex: fullWidth ? 1 : undefined,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const groupRole = selectionMode === "single" ? "radiogroup" : "group";

  return (
    <div
      role={groupRole}
      aria-label={ariaLabel}
      aria-orientation={orientation}
      aria-disabled={groupDisabled || undefined}
      style={containerStyle}
    >
      {options.map((option, index) => {
        const selected = isSelected(option.value);
        const itemDisabled = groupDisabled || option.disabled;
        const isTabStop = index === focusIndex;

        const itemStyle: CSSProperties = {
          ...baseButtonStyle,
          background: selected
            ? toggleGroupTokens.selectedBackground
            : toggleGroupTokens.unselectedBackground,
          color: selected
            ? toggleGroupTokens.selectedColor
            : toggleGroupTokens.unselectedColor,
          cursor: itemDisabled ? "not-allowed" : "pointer",
        };

        const itemRole = selectionMode === "single" ? "radio" : undefined;
        const ariaProps =
          selectionMode === "single"
            ? { "aria-checked": selected }
            : { "aria-pressed": selected };

        return (
          <button
            key={option.value}
            ref={setItemRef(index)}
            type="button"
            role={itemRole}
            data-selected={selected || undefined}
            disabled={itemDisabled}
            tabIndex={isTabStop && !itemDisabled ? 0 : -1}
            style={itemStyle}
            onClick={() => handleSelect(option.value)}
            onFocus={() => setFocusIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            {...ariaProps}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
