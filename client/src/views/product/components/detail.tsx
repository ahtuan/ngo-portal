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

const Detail = ({ form }: CardItemProps) => {
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
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cân nặng (kg)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Detail;
