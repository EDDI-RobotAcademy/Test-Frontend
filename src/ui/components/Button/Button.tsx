"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
import { Spinner } from "./Spinner";
import {
  buttonSizeTokens,
  buttonTokens,
  buttonVariantTokens,
} from "./tokens";
import type { ButtonProps } from "./types";

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  leading,
  trailing,
  fullWidth = false,
  loadingLabel,
  children,
  ref,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  style: styleOverride,
  ...rest
}: ButtonProps) {
  const sizeToken = buttonSizeTokens[size];
  const variantToken = buttonVariantTokens[variant];

  const isDisabled = disabled || loading;

  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [focused, setFocused] = useState(false);

  const background = (() => {
    if (isDisabled) return variantToken.disabledBackground;
    if (active) return variantToken.activeBackground;
    if (hovered) return variantToken.hoverBackground;
    return variantToken.background;
  })();

  const color = isDisabled ? variantToken.disabledColor : variantToken.color;
  const border = isDisabled ? variantToken.disabledBorder : variantToken.border;

  const baseStyle: CSSProperties = {
    display: fullWidth ? "flex" : "inline-flex",
    width: fullWidth ? "100%" : undefined,
    alignItems: "center",
    justifyContent: "center",
    gap: sizeToken.gap,
    height: sizeToken.height,
    paddingInline: sizeToken.paddingX,
    fontSize: sizeToken.fontSize,
    fontWeight: buttonTokens.fontWeight,
    lineHeight: 1,
    borderRadius: sizeToken.borderRadius,
    border,
    background,
    color,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: loading ? buttonTokens.loadingOpacity : 1,
    boxShadow:
      focused && !isDisabled
        ? `0 0 0 ${buttonTokens.focusRingWidth} ${variantToken.focusRingColor}`
        : "none",
    transition: `background-color ${buttonTokens.transitionDuration} ease, box-shadow ${buttonTokens.transitionDuration} ease, color ${buttonTokens.transitionDuration} ease, border-color ${buttonTokens.transitionDuration} ease`,
    fontFamily: "inherit",
    boxSizing: "border-box",
    userSelect: "none",
    whiteSpace: "nowrap",
    ...styleOverride,
  };

  const slotStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: sizeToken.iconSize,
    height: sizeToken.iconSize,
    flexShrink: 0,
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      style={baseStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        setActive(false);
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        setActive(true);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setActive(false);
        onMouseUp?.(e);
      }}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
    >
      {loading ? (
        <span style={slotStyle} aria-hidden="true">
          <Spinner size={sizeToken.spinnerSize} ariaLabel={loadingLabel} />
        </span>
      ) : leading != null ? (
        <span style={slotStyle} aria-hidden="true">
          {leading}
        </span>
      ) : null}
      <span>{children}</span>
      {trailing != null && !loading ? (
        <span style={slotStyle} aria-hidden="true">
          {trailing}
        </span>
      ) : null}
    </button>
  );
}
