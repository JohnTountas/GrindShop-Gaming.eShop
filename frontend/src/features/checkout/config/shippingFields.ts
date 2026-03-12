/**
 * Shipping form field metadata keeps the delivery-address layout declarative.
 */
import type { ShippingAddress } from '@/shared/types';

// Shipping field configuration rendered by the delivery-address section.
export interface ShippingFieldConfig {
  key: keyof ShippingAddress;
  label: string;
  placeholder: string;
  autoComplete: string;
}

export const SHIPPING_FIELD_ROWS: ShippingFieldConfig[][] = [
  [
    {
      key: 'fullName',
      label: 'Full name',
      placeholder: 'Full name',
      autoComplete: 'name',
    },
  ],
  [
    {
      key: 'address',
      label: 'Street address',
      placeholder: 'Street address',
      autoComplete: 'address-line1',
    },
  ],
  [
    {
      key: 'city',
      label: 'City',
      placeholder: 'City',
      autoComplete: 'address-level2',
    },
    {
      key: 'state',
      label: 'State',
      placeholder: 'State / Region',
      autoComplete: 'address-level1',
    },
  ],
  [
    {
      key: 'zipCode',
      label: 'ZIP code',
      placeholder: 'ZIP code',
      autoComplete: 'postal-code',
    },
    {
      key: 'country',
      label: 'Country',
      placeholder: 'Country',
      autoComplete: 'country-name',
    },
  ],
  [
    {
      key: 'phone',
      label: 'Phone number',
      placeholder: 'Phone number',
      autoComplete: 'tel',
    },
  ],
];
