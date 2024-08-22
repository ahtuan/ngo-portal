"use client";

import React, { useEffect, useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { CardItemProps } from "@views/product/upsert";
import { Switch } from "@@/ui/switch";
import Currency from "@@/currency";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UNIT_ENUM } from "@/constants/enums";
import removeAccents from "remove-accents";

export const OtherOption = {
  uuid: "other",
  name: "Khác",
};

const Category = ({ form }: CardItemProps) => {
  const [byKgSelect, setByKgSelect] = useState<Common.Option[]>([]);
  const [pcsSelect, setPCsSelect] = useState<Common.Option[]>([]);

  const { data } = useSWR(cacheKey, categoryRequest.getAll);
  const [category, categoryByKg, isUsedCategoryPrice, name] = form.watch([
    "categoryUuid",
    "categoryUuidByKg",
    "isUsedCategoryPrice",
    "name",
  ]);

  useEffect(() => {
    if (data?.length) {
      const byKgArr = data?.filter((item) => item.unit === UNIT_ENUM.KG);
      if (byKgArr?.length) {
        setByKgSelect(
          byKgArr.map((item) => ({
            value: item.uuid,
            label: item.name,
          })),
        );
      }
      setPCsSelect(
        data?.reduce((prev, item) => {
          if (item.unit === UNIT_ENUM.KG) {
            return prev;
          }
          return [
            ...prev,
            {
              value: item.uuid,
              label: item.name,
            },
          ];
        }, [] as Common.Option[]),
      );
    }
  }, [data]);

  useEffect(() => {
    if (!isUsedCategoryPrice && categoryByKg) {
      form.setValue("categoryUuidByKg", "");
    }
    if (isUsedCategoryPrice && categoryByKg) {
      const price = data?.find((item) => item.uuid === categoryByKg)?.price;
      if (price) {
        form.setValue("price", price);
      }
    }
  }, [isUsedCategoryPrice, data, form, categoryByKg]);

  useEffect(() => {
    if (isUsedCategoryPrice && !categoryByKg && byKgSelect.length > 0) {
      const defaultValue = byKgSelect[0].value;
      form.setValue("categoryUuidByKg", defaultValue);
    }
  }, [isUsedCategoryPrice]);

  useEffect(() => {
    const type = removeAccents(name.trim().split(" ")[0]).toLowerCase();
    const cateType = pcsSelect.find((item) =>
      removeAccents(item.label).toLowerCase().includes(type),
    );
    if (type && cateType) {
      form.setValue("categoryUuid", cateType.value);
    }
  }, [name]);
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
                      {pcsSelect.map(({ value, label }) => (
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
            <div
              className={cn(
                "flex sm:col-span-2 gap-4",
                category ? "visible" : "hidden",
              )}
            >
              <FormField
                control={form.control}
                name="isUsedCategoryPrice"
                render={({ field }) => (
                  <FormItem className={cn("space-y-2 min-w-[5rem]")}>
                    <FormLabel>Bán kg</FormLabel>
                    <br />
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryUuidByKg"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "w-full",
                      isUsedCategoryPrice ? "visible" : "hidden",
                    )}
                  >
                    <FormLabel>Đồng giá kg</FormLabel>
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
                        {byKgSelect.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                        {categoryByKg && (
                          <Button
                            className="w-full"
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              form.setValue("categoryUuidByKg", "");
                            }}
                          >
                            Xoá
                          </Button>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
