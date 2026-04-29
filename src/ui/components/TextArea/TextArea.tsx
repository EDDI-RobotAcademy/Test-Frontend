"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
} from "react";
import { textAreaTokens as t } from "./tokens";
import type { TextAreaCounterInfo, TextAreaProps } from "./types";

function resolveBorderColor(args: {
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
}): string {
  if (args.invalid) return t.invalidBorderColor;
  if (args.disabled) return t.disabledBorderColor;
  if (args.focused) return t.focusBorderColor;
  return t.defaultBorderColor;
}

function resolveBoxShadow(args: {
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
}): string {
  if (args.disabled || !args.focused) return "none";
  if (args.invalid) {
    return `0 0 0 ${t.focusRingWidth} ${t.invalidRingColor}`;
  }
  return `0 0 0 ${t.focusRingWidth} ${t.focusRingColor}`;
}

function resolveBackground(args: {
  disabled: boolean;
  readOnly: boolean;
}): string {
  if (args.disabled) return t.disabledBackground;
  if (args.readOnly) return t.readOnlyBackground;
  return t.background;
}

export function TextArea({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
  readOnly = false,
  rows = 3,
  maxRows,
  autoResize = false,
  resize,
  maxLength,
  maxLengthBehavior = "block",
  showCounter,
  counterSlot,
  id,
  ariaLabel,
  describedBy,
  ref,
  onFocus,
  onBlur,
  ...rest
}: TextAreaProps) {
  const reactId = useId();
  const textareaId = id ?? `textarea-${reactId}`;
  const counterId = `${textareaId}-counter`;

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(
    defaultValue ?? "",
  );
  const currentValue = isControlled ? (value ?? "") : uncontrolledValue;

  const [focused, setFocused] = useState(false);
  const internalRef = useRef<HTMLTextAreaElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref && typeof ref === "object") {
        (ref as { current: HTMLTextAreaElement | null }).current = node;
      }
    },
    [ref],
  );

  const overflow =
    maxLength !== undefined && currentValue.length > maxLength;
  const computedInvalid =
    invalid || (overflow && maxLengthBehavior === "warn");

  const adjustHeight = useCallback(() => {
    const node = internalRef.current;
    if (!node || !autoResize) return;
    node.style.height = "auto";
    const computed = window.getComputedStyle(node);
    const lineHeight = parseFloat(computed.lineHeight);
    const paddingTop = parseFloat(computed.paddingTop);
    const paddingBottom = parseFloat(computed.paddingBottom);
    const borderTop = parseFloat(computed.borderTopWidth);
    const borderBottom = parseFloat(computed.borderBottomWidth);

    const cap =
      maxRows !== undefined && Number.isFinite(lineHeight)
        ? maxRows * lineHeight + paddingTop + paddingBottom + borderTop + borderBottom
        : Number.POSITIVE_INFINITY;

    const next = Math.min(node.scrollHeight, cap);
    node.style.height = `${next}px`;
    node.style.overflowY = node.scrollHeight > next ? "auto" : "hidden";
  }, [autoResize, maxRows]);

  useLayoutEffect(() => {
    adjustHeight();
  }, [currentValue, adjustHeight]);

  useEffect(() => {
    if (!autoResize) return;
    const onResize = () => adjustHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [autoResize, adjustHeight]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setUncontrolledValue(e.target.value);
    onChange?.(e);
  };

  const handleFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const effectiveResize = autoResize ? "none" : (resize ?? "vertical");

  const containerStyle: CSSProperties = {
    display: "inline-block",
    width: "100%",
  };

  const textareaStyle: CSSProperties = {
    width: "100%",
    minHeight: `${rows * t.lineHeight}em`,
    boxSizing: "border-box",
    padding: `${t.paddingY} ${t.paddingX}`,
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    color: disabled ? t.disabledTextColor : t.textColor,
    background: resolveBackground({ disabled, readOnly }),
    border: `${t.borderWidth} solid ${resolveBorderColor({
      focused,
      invalid: computedInvalid,
      disabled,
    })}`,
    borderRadius: t.borderRadius,
    boxShadow: resolveBoxShadow({
      focused,
      invalid: computedInvalid,
      disabled,
    }),
    outline: "none",
    resize: effectiveResize,
    transition:
      "border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease",
    fontFamily: "inherit",
  };

  const counterInfo: TextAreaCounterInfo = {
    count: currentValue.length,
    max: maxLength,
    overflow,
  };

  const shouldShowCounter =
    showCounter ?? (maxLength !== undefined || counterSlot !== undefined);

  const counterText =
    maxLength !== undefined
      ? `${currentValue.length} / ${maxLength}`
      : `${currentValue.length}`;

  const counterStyle: CSSProperties = {
    fontSize: t.counterFontSize,
    color: overflow ? t.counterOverflowColor : t.counterColor,
    marginTop: t.counterMarginTop,
    textAlign: "right",
  };

  const renderedCounter = (() => {
    if (!shouldShowCounter) return null;
    if (typeof counterSlot === "function") return counterSlot(counterInfo);
    if (counterSlot !== undefined) return counterSlot;
    return counterText;
  })();

  const nativeMaxLength =
    maxLength !== undefined && maxLengthBehavior === "block"
      ? maxLength
      : undefined;

  return (
    <div style={containerStyle}>
      <textarea
        {...rest}
        ref={setRefs}
        id={textareaId}
        rows={rows}
        value={isControlled ? currentValue : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={nativeMaxLength}
        aria-label={ariaLabel}
        aria-invalid={computedInvalid || undefined}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        aria-describedby={
          [describedBy, shouldShowCounter ? counterId : undefined]
            .filter(Boolean)
            .join(" ") || undefined
        }
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={computedInvalid || undefined}
        data-focused={focused || undefined}
        data-overflow={overflow || undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={textareaStyle}
      />
      {shouldShowCounter ? (
        <div id={counterId} style={counterStyle} aria-live="polite">
          {renderedCounter}
        </div>
      ) : null}
    </div>
  );
}
