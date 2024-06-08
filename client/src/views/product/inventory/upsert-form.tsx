"use client";

import React from "react";
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
  InventoryType,
} from "@/schemas/inventory.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@@/ui/input";
import Item from "@views/product/inventory/item";
import Currency from "@@/currency";
import { ToggleGroup, ToggleGroupItem } from "@@/ui/toggle-group";
import { formatCurrency } from "@/lib/utils";
import { Label } from "@@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/ui/select";
import { InventoryStatus } from "@/constants/status";
import { Button } from "@@/ui/button";
import { inventoryRequest } from "@/api-requests/inventory.request";
import { useToast } from "@@/ui/use-toast";

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
      grossWeight: 0,
    },
  });

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
    }
    // Create form
    const createRes = await inventoryRequest.create({
      ...values,
      grossWeight: values.grossWeight.toString(), // Because of this field
      // store as decimal so BE not support in number type
    });

    if (!createRes) {
      throw new Error(
        "Có lỗi xảy ra trong quá trình thay đổi thông tin lô" + " hàng",
      );
    }
    message = createRes.message;

    toast({
      title: "Thông tin lô hàng",
      description: message,
    });
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
          name="unit"
          render={({ field }) => (
            <Item label="Đơn vị">
              <ToggleGroup
                type="single"
                variant="outline"
                {...field}
                className="justify-start"
              >
                <ToggleGroupItem value="kg">KG</ToggleGroupItem>
              </ToggleGroup>
            </Item>
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
          <Label className="sm:text-right">Giá ước lượng</Label>
          <p className="sm:col-span-3">{getPricePerUnit()}</p>
        </div>
        {status === InventoryStatus["Nhập kho"] && (
          <div className="sm:grid sm:grid-cols-4 sm:items-center sm:gap-4 pt-2 text-muted-foreground">
            <Label className="sm:text-right">Giá đề xuất</Label>
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
