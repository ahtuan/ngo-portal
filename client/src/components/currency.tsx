/**
 * v0 by Vercel.
 * @see https://v0.dev/t/3K3iS9IWgaU
 * Documentation:
 *   https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Currency = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, value, onChange, maxLength = 13, ...props }, ref) => {
    const [formattedValue, setFormattedValue] = React.useState(
      formatCurrency(value) || "",
    );

    const handleChange = (e: any) => {
      const inputValue = e.target.value;
      const formattedValue = formatCurrency(inputValue);
      setFormattedValue(formattedValue);
      e.target.value = +inputValue.replace(/\D/g, "");
      onChange?.(e);
    };

    return (
      <Input
        {...props}
        type="text"
        value={formattedValue}
        onChange={handleChange}
        maxLength={maxLength}
      />
    );
  },
);
Currency.displayName = "Currency";
export default Currency;
