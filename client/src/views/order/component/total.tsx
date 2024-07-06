import React, { useState } from "react";
import { Card, CardContent } from "@@/ui/card";
import { FormControl, FormField, FormItem, FormMessage } from "@@/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/ui/select";
import { PAYMENT_TYPE } from "@/constants/enums";
import { CreateOrderProps } from "@views/order/create";
import { formatCurrency } from "@/lib/utils";
import Currency from "@@/currency";

type RowProps = {
  text: string;
  children?: React.ReactNode;
};
export const RowRender = ({ text, children }: RowProps) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-2 text-sm">{text}</div>
      <div className="text-right">{children}</div>
    </div>
  );
};

const Total = ({ form }: CreateOrderProps) => {
  const [paymentType, totalPrice, totalQuantity] = form.watch([
    "paymentType",
    "totalPrice",
    "totalQuantity",
  ]);
  const [amount, setAmount] = useState<number>(0);
  const getAmount = (value: number) => {
    return `${formatCurrency(value) || 0} đ`;
  };

  return (
    <Card>
      <CardContent className="grid gap-2 mt-4">
        <RowRender text="Tổng số lượng">{totalQuantity}</RowRender>
        <RowRender text="Thành tiền">{getAmount(totalPrice)}</RowRender>
        <RowRender text="Thực thu">
          <FormField
            control={form.control}
            name="actualPrice"
            render={({ field }) => (
              <FormItem>
                <Currency {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </RowRender>
        <RowRender text="Phương thức thanh toán">
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phương thức thanh toán" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PAYMENT_TYPE).map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </RowRender>
        {paymentType === PAYMENT_TYPE.CASH.value && (
          <>
            <RowRender text="Tiền khách đưa">
              <Currency
                onChange={(event) => {
                  const amount =
                    +event.target.value - form.getValues("actualPrice");
                  setAmount(amount);
                }}
              />
            </RowRender>
            {amount > 0 && (
              <RowRender text="Tiền trả lại">
                {formatCurrency(amount, "đ")}
              </RowRender>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Total;
