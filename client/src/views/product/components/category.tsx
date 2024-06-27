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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { CardItemProps } from "@views/product/upsert";
import { Switch } from "@@/ui/switch";
import Currency from "@@/currency";
import { Input } from "@@/ui/input";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@@/ui/tooltip";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export const OtherOption = {
  uuid: "other",
  name: "Khác",
};

const Category = ({ form }: CardItemProps) => {
  const { data } = useSWR(cacheKey, categoryRequest.getAll);
  const category = form.watch("categoryUuid");
  const categoryByKg = form.watch("categoryUuidByKg");
  const isUsedCategoryPrice = form.watch("isUsedCategoryPrice");

  useEffect(() => {
    if (category && category !== OtherOption.uuid && isUsedCategoryPrice) {
      const categoryPrice =
        data?.find(
          (item) => item.uuid === (categoryByKg ? categoryByKg : category),
        )?.price ?? 0;

      form.setValue("price", categoryPrice);
    }
    if (category === OtherOption.uuid) {
      form.setValue("isUsedCategoryPrice", false);
    } else {
      form.setValue("categoryName", undefined);
    }
    if (!isUsedCategoryPrice) {
      form.setValue("categoryUuidByKg", "");
    }
  }, [isUsedCategoryPrice, category, data, form, categoryByKg]);

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
                      {[
                        ...(data?.filter((item) => item.unit !== "KG") ?? []),
                        OtherOption,
                      ].map((item) => (
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
            <div
              className={cn(
                "flex sm:col-span-2 gap-4",
                category === OtherOption.uuid || !category
                  ? "hidden"
                  : "visible",
              )}
            >
              <FormField
                control={form.control}
                name="isUsedCategoryPrice"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      "space-y-2 max-w-[90px]",
                      category !== OtherOption.uuid ? "visible" : "hidden",
                    )}
                  >
                    <FormLabel>
                      Đồng giá
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <QuestionMarkCircledIcon className="ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sử dụng giá của phân loại để làm giá sản phẩm</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>

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
                        {[
                          ...(data?.filter((item) => item.unit === "KG") ?? []),
                        ].map((item) => (
                          <SelectItem key={item.uuid} value={item.uuid}>
                            {item.name}
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
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem
                  className={
                    category === OtherOption.uuid ? "visible" : "hidden"
                  }
                >
                  <FormLabel>Tên phân loại</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
