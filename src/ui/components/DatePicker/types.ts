export type DatePickerSelectionMode = "single" | "range" | "multiple";

export type DatePickerDisplayMode = "popover" | "inline";

export type DisabledDatesProp = Date[] | ((date: Date) => boolean);

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DatePickerBaseProps {
  displayMode?: DatePickerDisplayMode;
  min?: Date;
  max?: Date;
  disabledDates?: DisabledDatesProp;
  locale?: string;
  weekStartsOn?: 0 | 1;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  selectionMode: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  selectionMode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
}

export interface DatePickerMultipleProps extends DatePickerBaseProps {
  selectionMode: "multiple";
  value?: Date[];
  defaultValue?: Date[];
  onChange?: (value: Date[]) => void;
}

export type DatePickerProps =
  | DatePickerSingleProps
  | DatePickerRangeProps
  | DatePickerMultipleProps;

export type DayCellState = {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isDisabled: boolean;
};
