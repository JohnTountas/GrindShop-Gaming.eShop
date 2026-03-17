/**
 * Reusable text-field wrapper for checkout labels and inputs.
 */
import type { InputHTMLAttributes } from "react";

interface CheckoutTextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  inputClassName: string;
  labelClassName?: string;
  helperText?: string;
}

// Keeps checkout text inputs visually consistent across sections.
export function CheckoutTextField({
  label,
  id,
  inputClassName,
  labelClassName = "block text-sm font-semibold text-primary-800",
  helperText,
  ...inputProps
}: CheckoutTextFieldProps) {
  return (
    <label htmlFor={id} className={`${labelClassName} group`}>
      {label}
      <input id={id} className={inputClassName} {...inputProps} />
      {helperText && (
        <span className="mt-1 hidden text-xs font-medium text-red-400 group-focus-within:block">
          {helperText}
        </span>
      )}
    </label>
  );
}
