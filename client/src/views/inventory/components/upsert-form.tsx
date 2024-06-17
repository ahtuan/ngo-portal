"use client";

import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { useForm } from "react-hook-form";
import {
  InventoryBody,
  InventoryCreate,
  InventorySubmit,
  InventoryType,
} from "@/schemas/inventory.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@@/ui/input";
import Item from "@views/inventory/components/item";
import Currency from "@@/currency";
import { ToggleGroup, ToggleGroupItem } from "@@/ui/toggle-group";
import { formatCurrency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/ui/select";
import { InventoryStatus } from "@/constants/status";
import { Button } from "@@/ui/button";
import {
  inventoryEndpoint as cacheKey,
  inventoryRequest,
} from "@/api-requests/inventory.request";
import { useToast } from "@@/ui/use-toast";
import { mutate } from "swr";

type Props = {
  data?: InventoryType;
  onClose?: () => void;
};

const UpsertForm = ({ data, onClose }: Props) => {
  const { toast } = useToast();
  const form = useForm<InventoryCreate>({
    resolver: zodResolver(InventoryBody),
    defaultValues: {
      source: "",
      unit: "kg",
      status: InventoryStatus["Cọc hàng"],
      grossWeight: 1,
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      console.log("herer");
      form.setValue("status", data.status);
      form.setValue("price", data.price);
      form.setValue("source", data.source);
      form.setValue("grossWeight", data.grossWeight);
      form.setValue("description", data.description ?? "");
    }
  }, [data]);

  const priceWatches = form.watch(["price", "grossWeight"]);
  const status = form.watch("status");

  const getPricePerUnit = (isActual: boolean = false) => {
    let price = priceWatches[1];
    if (isActual) {
      price = data?.actualWeight || 900;
    }
    return (formatCurrency(Math.floor(priceWatches[0] / price)) || 0) + " đ";
  };

  const onSubmit = async (values: InventoryCreate) => {
    let message;
    if (data) {
      // Update form
      const payload: Partial<InventorySubmit> = {
        ...values,
        grossWeight: values.grossWeight.toString(),
      };
      Object.entries(values).map(([key, value]) => {
        const validKey = key as
          | "price"
          | "grossWeight"
          | "status"
          | "description"
          | "source";
        if (data[validKey]?.toString() === value?.toString()) {
          delete payload[validKey];
        }
      });
      const updateRes = await inventoryRequest.update(data.uuid, payload);
      message = updateRes.message;
    } else {
      // Create form
      const createRes = await inventoryRequest.create({
        ...values,
        grossWeight: values.grossWeight.toString(), // Because of this field
        // store as decimal so BE not support in number type
      });
      message = createRes.message;
    }

    toast({
      title: "Thông tin lô hàng",
      description: message,
    });
    await mutate(cacheKey);
    onClose?.();
  };

  return (
    <Form {...form}>
      <form className="grid gap-1" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <Item label="Nguồn hàng">
              <Input {...field} />
            </Item>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <Item label="Mô tả">
              <Input {...field} />
            </Item>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem className="sm:grid sm:grid-cols-4 sm:items-baseline sm:gap-4">
              <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  sm:text-right">
                Đơn vị
              </span>
              <div className="grid sm:col-span-3 gap-1">
                <FormControl>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    {...field}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="kg">KG</ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
              <FormLabel className="text-right">Trạng thái</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="sm:col-span-3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(InventoryStatus).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grossWeight"
          render={({ field }) => (
            <Item label="Cân nặng">
              <Input type="number" {...field} />
            </Item>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <Item label="Giá nhập">
              <Currency {...field} />
            </Item>
          )}
        />
        <div className="sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 pt-2 text-muted-foreground">
          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70  sm:text-right">
            Giá ước lượng
          </span>
          <p className="sm:col-span-3">{getPricePerUnit()}</p>
        </div>
        {status === InventoryStatus["Nhập kho"] && (
          <div className="sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 pt-2 text-muted-foreground">
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-right">
              Giá đề xuất
            </span>
            <p className="sm:col-span-3">{getPricePerUnit(true)}</p>
          </div>
        )}
        <div className="flex justify-end border border-0 border-t pt-6 mt-4">
          <Button type="submit" className="w-24">
            Lưu
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpsertForm;
