"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/ui/select";
import useSWR from "swr";
import {
  categoryEndpoint as cacheKey,
  categoryRequest,
} from "@/api-requests/category.request";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { CardItemProps } from "@views/product/upsert";
import { Switch } from "@@/ui/switch";
import Currency from "@@/currency";

export const OtherOption = {
  uuid: "other",
  name: "Khác",
};

const Category = ({ form }: CardItemProps) => {
  const { data } = useSWR(cacheKey, categoryRequest.getAll);
  const category = form.watch("categoryUuid");
  const isUsedCategoryPrice = form.watch("isUsedCategoryPrice");

  useEffect(() => {
    if (category && category !== OtherOption.uuid && isUsedCategoryPrice) {
      const categoryPrice =
        data?.find((item) => item.uuid === category)?.price ?? 0;

      form.setValue("price", categoryPrice);
    }
  }, [isUsedCategoryPrice, category]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân loại sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-6 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="categoryUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phân loại</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...(data ?? []), OtherOption].map((item) => (
                        <SelectItem key={item.uuid} value={item.uuid}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-3 sm:col-span-2">
              {category && category !== OtherOption.uuid && (
                <FormField
                  control={form.control}
                  name="isUsedCategoryPrice"
                  render={({ field }) => (
                    <FormItem className="flex justify-between items-center h-full">
                      <div className="grid gap-4">
                        <FormLabel>Đồng giá</FormLabel>
                        <FormDescription>
                          Sử dụng giá của phân loại để làm giá sản phẩm
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá sản phẩm</FormLabel>
                <FormControl>
                  <Currency
                    {...field}
                    onKeyDown={() => {
                      form.setValue("isUsedCategoryPrice", false);
                    }}
                  />
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

export default Category;
