/**
 * Shipping form field metadata keeps the delivery-address layout declarative.
 */
import type { InputHTMLAttributes } from "react";
import type { ShippingAddress } from "@/shared/types";

// Shipping field configuration rendered by the delivery-address section.
export interface ShippingFieldConfig {
  key: keyof ShippingAddress;
  label: string;
  placeholder: string;
  autoComplete: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
  maxLength?: number;
  helperText?: string;
}

export const SHIPPING_FIELD_ROWS: ShippingFieldConfig[][] = [
  [
    {
      key: "fullName",
      label: "Full name",
      placeholder: "Full name",
      autoComplete: "name",
    },
  ],
  [
    {
      key: "address",
      label: "Street address",
      placeholder: "Street address",
      autoComplete: "address-line1",
    },
  ],
  [
    {
      key: "city",
      label: "City",
      placeholder: "City",
      autoComplete: "address-level2",
    },
    {
      key: "state",
      label: "State",
      placeholder: "State / Region",
      autoComplete: "address-level1",
    },
  ],
  [
    {
      key: "zipCode",
      label: "ZIP code",
      placeholder: "e.g. 11527",
      autoComplete: "postal-code",
      inputMode: "numeric",
      pattern: "[0-9]*",
      helperText: "Enter digits only.",
    },
    {
      key: "country",
      label: "Country",
      placeholder: "Country",
      autoComplete: "country-name",
    },
  ],
  [
    {
      key: "phone",
      label: "Phone number",
      placeholder: "e.g. 6901234567",
      autoComplete: "tel",
      inputMode: "numeric",
      pattern: "[0-9]*",
      helperText: "Enter digits only, without spaces or symbols.",
    },
  ],
];
