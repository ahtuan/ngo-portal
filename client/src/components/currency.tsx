/**
 * v0 by Vercel.
 * @see https://v0.dev/t/3K3iS9IWgaU
 * Documentation:
 *   https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import * as React from "react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Currency = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, value, onChange, onBlur, maxLength = 13, ...props }, ref) => {
    const [formattedValue, setFormattedValue] = React.useState(
      formatCurrency(value) || "",
    );

    useEffect(() => {
      if (value) {
        setFormattedValue(formatCurrency(value));
      } else {
        setFormattedValue("");
      }
    }, [value]);

    const handleChange = (e: any) => {
      const inputValue = e.target.value;
      const formattedValue = formatCurrency(inputValue);
      setFormattedValue(formattedValue);
      e.target.value = +inputValue.replace(/\D/g, "");
      onChange?.(e);
    };

    const handleBlur = (e: any) => {
      let amount = +formattedValue.replace(/\D/g, "");
      amount = amount < 1000 ? amount * 1000 : amount;
      const formattedAmount = formatCurrency(amount);
      if (formattedAmount !== formattedValue) {
        setFormattedValue(formatCurrency(amount));
        e.target.value = amount;
        onChange?.(e);
      }
      if (onBlur) {
        onBlur?.(e);
      }
    };

    return (
      <Input
        {...props}
        type="text"
        value={formattedValue}
        onChange={handleChange}
        maxLength={maxLength}
        onBlur={handleBlur}
      />
    );
  },
);
Currency.displayName = "Currency";
export default Currency;
