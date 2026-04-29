import type {
  ChangeEvent,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
} from "react";

export type TextAreaResize = "none" | "vertical" | "horizontal" | "both";

export type MaxLengthBehavior = "block" | "warn";

export interface TextAreaCounterInfo {
  count: number;
  max?: number;
  overflow: boolean;
}

type NativeTextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  | "value"
  | "defaultValue"
  | "onChange"
  | "disabled"
  | "readOnly"
  | "rows"
  | "maxLength"
>;

export interface TextAreaProps extends NativeTextAreaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  rows?: number;
  maxRows?: number;
  autoResize?: boolean;
  resize?: TextAreaResize;
  maxLength?: number;
  maxLengthBehavior?: MaxLengthBehavior;
  showCounter?: boolean;
  counterSlot?: ReactNode | ((info: TextAreaCounterInfo) => ReactNode);
  id?: string;
  ariaLabel?: string;
  describedBy?: string;
  ref?: Ref<HTMLTextAreaElement>;
}
