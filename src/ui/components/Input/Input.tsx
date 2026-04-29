"use client";

import {
  useId,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";
import { inputTokens } from "./tokens";
import type { InputProps } from "./types";

function resolveBorderColor(args: {
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
}): string {
  if (args.invalid) return inputTokens.invalidBorderColor;
  if (args.disabled) return inputTokens.disabledBorderColor;
  if (args.focused) return inputTokens.focusBorderColor;
  return inputTokens.defaultBorderColor;
}

function resolveBoxShadow(args: {
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
}): string {
  if (args.disabled || !args.focused) return "none";
  if (args.invalid) {
    return `0 0 0 ${inputTokens.focusRingWidth} ${inputTokens.invalidRingColor}`;
  }
  return `0 0 0 ${inputTokens.focusRingWidth} ${inputTokens.focusRingColor}`;
}

function resolveBackground(args: { disabled: boolean; readOnly: boolean }): string {
  if (args.disabled) return inputTokens.disabledBackground;
  if (args.readOnly) return inputTokens.readOnlyBackground;
  return inputTokens.background;
}

export function Input({
  type = "text",
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
  readOnly = false,
  leading,
  trailing,
  id,
  ariaLabel,
  describedBy,
  ref,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;

  const [focused, setFocused] = useState(false);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const containerStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: inputTokens.gap,
    height: inputTokens.height,
    paddingInline: inputTokens.paddingX,
    paddingBlock: 0,
    border: `${inputTokens.borderWidth} solid ${resolveBorderColor({
      focused,
      invalid,
      disabled,
    })}`,
    borderRadius: inputTokens.borderRadius,
    background: resolveBackground({ disabled, readOnly }),
    boxShadow: resolveBoxShadow({ focused, invalid, disabled }),
    color: disabled ? inputTokens.disabledTextColor : inputTokens.textColor,
    cursor: disabled ? "not-allowed" : "text",
    transition:
      "border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease",
    width: "100%",
    boxSizing: "border-box",
  };

  const slotStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    color: invalid ? inputTokens.invalidSlotColor : inputTokens.slotColor,
    flexShrink: 0,
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: inputTokens.fontSize,
    lineHeight: inputTokens.lineHeight,
    color: "inherit",
    padding: 0,
    appearance: "none",
  };

  return (
    <div
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={invalid || undefined}
      data-focused={focused || undefined}
      style={containerStyle}
      onClick={() => {
        if (disabled) return;
        const el = document.getElementById(inputId);
        if (el instanceof HTMLInputElement) el.focus();
      }}
    >
      {leading != null ? (
        <span style={slotStyle} aria-hidden="true">
          {leading}
        </span>
      ) : null}
      <input
        {...rest}
        ref={ref}
        id={inputId}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        aria-describedby={describedBy}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={inputStyle}
      />
      {trailing != null ? (
        <span style={slotStyle} aria-hidden="true">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
