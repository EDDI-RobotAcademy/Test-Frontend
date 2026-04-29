"use client";

import type { CSSProperties } from "react";

interface SpinnerProps {
  size: string;
  color?: string;
  ariaLabel?: string;
}

export function Spinner({ size, color = "currentColor", ariaLabel }: SpinnerProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    display: "inline-block",
    borderRadius: "50%",
    border: "2px solid rgba(255, 255, 255, 0.35)",
    borderTopColor: color,
    animation: "button-spinner-rotate 0.7s linear infinite",
    boxSizing: "border-box",
    flexShrink: 0,
  };

  return (
    <span
      role="status"
      aria-label={ariaLabel ?? "Loading"}
      style={style}
    >
      <style>{`@keyframes button-spinner-rotate { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}
