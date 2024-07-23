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
import Sale from "@views/order/component/sale";

type RowProps = {
  text: React.ReactNode;
  children?: React.ReactNode;
};
export const RowRender = ({ text, children }: RowProps) => {
  return (
    <div className="grid gap-2 grid-cols-2">
      <div className="text-sm flex items-center">{text}</div>
      <div className="text-right text-sm">{children}</div>
    </div>
  );
};

const Total = ({
  form,
  isOnline,
}: CreateOrderProps & {
  isOnline?: boolean;
}) => {
  const [paymentType, totalPrice, totalQuantity, afterSale, sale] = form.watch([
    "paymentType",
    "totalPrice",
    "totalQuantity",
    "afterSale",
    "sale",
  ]);
  const [amount, setAmount] = useState<number>(0);
  const getAmount = (value: number) => {
    return `${formatCurrency(value) || 0} đ`;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Card>
      <CardContent className="grid gap-2 mt-4">
        <RowRender text="Tổng số lượng">{totalQuantity}</RowRender>
        <RowRender text="Thành tiền">
          <span
            className={sale ? "line-through" + " text-muted-foreground" : ""}
          >
            {getAmount(totalPrice)}
          </span>
        </RowRender>
        {sale && afterSale !== totalPrice && (
          <RowRender
            text={
              <div className="flex items-center">
                <span>Sau chiết khấu</span>
                <Sale {...sale} />
              </div>
            }
          >
            {getAmount(afterSale)}
          </RowRender>
        )}
        <RowRender text="Thực thu">
          <FormField
            control={form.control}
            name="actualPrice"
            render={({ field }) => (
              <FormItem>
                <Currency {...field} onKeyDown={onKeyDown} />
                <FormMessage />
              </FormItem>
            )}
          />
        </RowRender>
        {isOnline && (
          <RowRender text="Tiền cọc">
            <FormField
              control={form.control}
              name="deposit"
              render={({ field }) => (
                <FormItem>
                  <Currency {...field} onKeyDown={onKeyDown} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </RowRender>
        )}
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
                    {Object.values(PAYMENT_TYPE)
                      .filter(({ value, label }) =>
                        isOnline ? value === PAYMENT_TYPE.BANK.value : true,
                      )
                      .map(({ value, label }) => (
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
                onKeyDown={onKeyDown}
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
