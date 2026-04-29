import type {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  Ref,
} from "react";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "search"
  | "url"
  | "tel"
  | "number";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "disabled" | "readOnly"
>;

export interface InputProps extends NativeInputProps {
  type?: InputType;
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  id?: string;
  ariaLabel?: string;
  describedBy?: string;
  ref?: Ref<HTMLInputElement>;
}
