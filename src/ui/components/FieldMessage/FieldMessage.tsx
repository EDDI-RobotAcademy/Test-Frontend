"use client";

import type { CSSProperties } from "react";
import {
  fieldMessageSeverityTokens,
  fieldMessageTokens as t,
} from "./tokens";
import type { FieldMessageProps } from "./types";

function defaultAriaLive(severity: FieldMessageProps["severity"]) {
  if (severity === "error") return "assertive" as const;
  return "polite" as const;
}

export function FieldMessage({
  severity = "info",
  icon = true,
  ariaLive,
  children,
  style: styleOverride,
  ...rest
}: FieldMessageProps) {
  const sev = fieldMessageSeverityTokens[severity];
  const liveMode = ariaLive ?? defaultAriaLive(severity);
  const role = severity === "error" ? "alert" : "status";

  const containerStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: t.gap,
    marginTop: t.marginTop,
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    fontWeight: t.fontWeight,
    color: sev.color,
    ...styleOverride,
  };

  const iconStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: t.iconSize,
    height: t.iconSize,
    color: sev.iconColor,
    flexShrink: 0,
    fontSize: t.iconSize,
    lineHeight: 1,
    marginTop: "1px",
  };

  const textStyle: CSSProperties = {
    minWidth: 0,
    flex: 1,
  };

  const renderedIcon = (() => {
    if (icon === false) return null;
    if (icon === true) return sev.glyph;
    return icon;
  })();

  return (
    <div
      {...rest}
      role={role}
      aria-live={liveMode}
      data-severity={severity}
      style={containerStyle}
    >
      {renderedIcon != null ? (
        <span style={iconStyle} aria-label={sev.ariaLabel} aria-hidden={icon === true ? undefined : true}>
          {renderedIcon}
        </span>
      ) : null}
      <span style={textStyle}>{children}</span>
    </div>
  );
}
