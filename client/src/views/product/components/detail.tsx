import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import { Input } from "@@/ui/input";
import { Textarea } from "@@/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { CardItemProps } from "@views/product/upsert";
import { Label } from "@@/ui/label";
import { fixed, formatCurrency } from "@/lib/utils";

type Props = {
  pricePerKg?: number;
} & CardItemProps;

const Detail = ({ form, pricePerKg }: Props) => {
  const weight = form.watch("weight");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên sản phẩm</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-24"
                    placeholder={`Kích thước: Dài x Rộng x Cao
Tình trạng:`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cân nặng (g)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Giá cost</Label>
              <p className="mt-4 text-sm">
                {formatCurrency(
                  fixed((pricePerKg || 0) * (weight / 1000), 0),
                  "đ",
                )}
              </p>
            </div>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng (cái/chiếc)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Detail;
