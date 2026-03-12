/**
 * Reusable text-field wrapper for checkout labels and inputs.
 */
import type { InputHTMLAttributes } from 'react';

interface CheckoutTextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  inputClassName: string;
  labelClassName?: string;
}

// Keeps checkout text inputs visually consistent across sections.
export function CheckoutTextField({
  label,
  id,
  inputClassName,
  labelClassName = 'block text-sm font-semibold text-primary-800',
  ...inputProps
}: CheckoutTextFieldProps) {
  return (
    <label htmlFor={id} className={labelClassName}>
      {label}
      <input id={id} className={inputClassName} {...inputProps} />
    </label>
  );
}
