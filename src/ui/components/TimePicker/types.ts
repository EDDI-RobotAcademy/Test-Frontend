export type TimeFormat = "12h" | "24h";

export type TimePickerDisplayMode = "popover" | "inline";

export interface TimeValue {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TimeStep {
  hour?: number;
  minute?: number;
  second?: number;
}

export interface TimePickerProps {
  format?: TimeFormat;
  displayMode?: TimePickerDisplayMode;
  value?: TimeValue | null;
  defaultValue?: TimeValue | null;
  onChange?: (value: TimeValue) => void;
  step?: TimeStep;
  showSeconds?: boolean;
  min?: TimeValue;
  max?: TimeValue;
  disabled?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  locale?: string;
  fullWidth?: boolean;
}

export type TimeUnit = "hours" | "minutes" | "seconds" | "period";

export type TimePeriod = "AM" | "PM";
