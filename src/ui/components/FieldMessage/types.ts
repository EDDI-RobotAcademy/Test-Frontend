import type { HTMLAttributes, ReactNode } from "react";

export type FieldMessageSeverity = "info" | "success" | "warning" | "error";

export type FieldMessageAriaLive = "off" | "polite" | "assertive";

type NativeDivProps = Omit<HTMLAttributes<HTMLDivElement>, "role">;

export interface FieldMessageProps extends NativeDivProps {
  severity?: FieldMessageSeverity;
  icon?: boolean | ReactNode;
  ariaLive?: FieldMessageAriaLive;
  children: ReactNode;
}
