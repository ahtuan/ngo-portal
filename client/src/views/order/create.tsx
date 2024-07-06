"use client";

import React from "react";
import { Form } from "@@/ui/form";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import Header from "./component/header";
import Scan from "@views/order/component/scan";
import Customer from "@views/order/component/customer";
import Items from "@views/order/component/items";
import Total from "@views/order/component/total";
import { Invoice, InvoiceBody, InvoiceCreate } from "@/schemas/invoice.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PAYMENT_TYPE } from "@/constants/enums";
import { ProductDetail } from "@/schemas/product.schema";
import { useToast } from "@@/ui/use-toast";
import { fixed } from "@/lib/utils";
import { invoiceRequest } from "@/api-requests/invoice.request";

export type CreateOrderProps = {
  form: UseFormReturn<InvoiceCreate>;
};

const Create = () => {
  const { toast } = useToast();
  const form = useForm<InvoiceCreate>({
    resolver: zodResolver(InvoiceBody),
    defaultValues: {
      items: [],
      paymentType: PAYMENT_TYPE.CASH.value,
      actualPrice: 0,
      stacks: [],
    },
  });
  const {
    control,
    formState: { errors },
  } = form;
  const { fields, insert, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const {
    fields: stackFields,
    append: stackAppend,
    remove: stackRemove,
    update: stackUpdate,
  } = useFieldArray({
    control,
    name: "stacks",
  });

  const getItemsUpdated = (
    item: Invoice.ItemType,
    value: number,
    replace: boolean = false,
  ) => {
    const byKg = item.unit.toUpperCase() === "KG";
    if (item.stock !== undefined && item.originalStock) {
      const newQuantity = replace ? value : item.quantity + value;
      const total = Math.floor(
        newQuantity * fixed((byKg ? item.weight : 1) * item.price),
      );
      const stock = replace ? item.originalStock - value : item.stock - 1;
      if (stock < 0) {
        toast({
          description: "Đã thêm quá số lượng hiện có.",
        });
        return;
      }
      if (newQuantity === 0) {
        toast({
          description: "Số lượng thay đổi phải lớn hơn 0",
        });
        return;
      }

      return {
        ...item,
        quantity: newQuantity,
        total,
        stock,
      };
    }
    console.error("Must have stock for PSC change");
    return;
  };

  const onUpdateTotal = () => {
    const itemsList = form.getValues("items");
    const stackList = form.getValues("stacks") || [];
    const [pcsQuantity, pcsPrice] = itemsList.reduce(
      (previousValue, currentValue) => {
        let [quantity, total] = previousValue;

        quantity += currentValue.quantity;
        total += currentValue.total;
        return [quantity, total];
      },
      [0, 0],
    );
    const [kgQuantity, kgPrice] = stackList.reduce(
      (previousValue, currentValue) => {
        let [quantity, total] = previousValue;
        quantity += currentValue.items.reduce((prev, current) => {
          return prev + current.quantity;
        }, 0);
        total += currentValue.total;
        return [quantity, total];
      },
      [0, 0],
    );

    form.setValue("totalQuantity", pcsQuantity + kgQuantity);
    form.setValue("totalPrice", pcsPrice + kgPrice);
    form.setValue("actualPrice", pcsPrice + kgPrice);
  };

  const handleUpdatePcs = (
    index: number,
    value: number,
    replace: boolean = false,
  ) => {
    const item = fields[index];
    const updatedItem = getItemsUpdated(item, value, replace);
    if (updatedItem) {
      update(index, updatedItem);
    }
  };

  const handleUpdateKg = (
    index: number,
    value: number,
    itemIndex: number = 0,
    addedItem?: Invoice.ItemType,
    replace: boolean = false,
    isDeleted: boolean = false,
  ) => {
    const existing = stackFields[index];
    let newWeight = 0;
    let total = 0;

    // -2 used for update stack with weight
    if (itemIndex === -2) {
      // Update weight and total price for category
      newWeight = fixed(replace ? value : existing.weight + value);
    }
    // Item not be in stack list
    else if (itemIndex === -1) {
      if (addedItem) {
        newWeight = fixed(existing.weight + addedItem.weight);
        existing.items = [...existing.items, addedItem];
      } else {
        console.error(
          "Stack item should be added new one. But dont have value",
        );
        return;
      }
    } else {
      // Update quantity of item and price base on weight for already
      // existed item (in stack)
      const item = existing.items[itemIndex];
      if (isDeleted) {
        newWeight = fixed(existing.weight - item.weight * item.quantity);
        existing.items = existing.items.filter(
          (filterItem) => filterItem.byDateId !== item.byDateId,
        );
        // If dont have any item in the stack when delete
        // Should delete for that stack
        if (existing.items.length === 0) {
          stackRemove(index);
          return;
        }
      } else {
        const updatedItem = getItemsUpdated(item, value, replace);
        if (updatedItem) {
          newWeight = fixed(
            existing.weight +
              (replace ? value - item.quantity : value) * item.weight,
          );
          item.quantity = updatedItem.quantity;
          item.total = updatedItem.total;
          item.stock = updatedItem.stock;
        } else {
          return;
        }
      }
    }

    total = fixed(newWeight * existing.price);
    stackUpdate(index, {
      ...existing,
      weight: newWeight,
      total,
    });
  };

  const onAppend = (data: ProductDetail) => {
    if (!data) {
      return;
    }
    const byKg = data.categoryUuidByKg ? true : false;
    const stock = data.quantity - data.soldOut;
    const general = {
      byDateId: data.byDateId,
      name: data.name,
      price: data.price,
      weight: data.weight,
      unit: byKg ? "Kg" : "Chiếc",
      originalStock: stock,
      stock: stock - 1,
    };
    if (data.categoryUuidByKg) {
      const index = stackFields.findIndex(
        (item) => item.name === data.categoryNameByKg,
      );
      // If stack (by category) never be in the list
      // and then add the new one for stack with first item got from data
      const total = data.weight * data.price;
      const newItem: Invoice.ItemType = {
        ...general,
        quantity: 1,
        total: total,
      };
      if (index === -1) {
        stackAppend({
          categoryUuidByKg: data.categoryUuidByKg,
          name: data.categoryNameByKg || "Gốm kg",
          price: data.price,
          weight: data.weight,
          total: total,
          items: [newItem],
        });
      } else {
        // If stack (by category) already been in list
        // Just update the existing item or add new one if item not be in
        // list items of stack
        const itemIndex = stackFields[index].items.findIndex(
          (item) => item.byDateId === data.byDateId,
        );
        handleUpdateKg(
          index,
          1,
          itemIndex,
          itemIndex === -1 ? newItem : undefined,
        );
      }
    } else {
      const index = fields.findIndex((item) => item.byDateId === data.byDateId);
      if (index === -1) {
        append({
          ...general,
          quantity: 1,
          total: data.price,
        });
      } else {
        handleUpdatePcs(index, 1);
      }
    }
    onUpdateTotal();
  };

  const onUpdate = (
    index: number,
    value: number,
    byKg: boolean,
    itemIndex: number = -1,
  ) => {
    if (byKg) {
      handleUpdateKg(index, value, itemIndex, undefined, true);
    } else {
      handleUpdatePcs(index, value, true);
    }
    onUpdateTotal();
  };

  const onDelete = (index: number, byKg: boolean, itemIndex: number = -1) => {
    if (byKg) {
      // Delete stack
      if (itemIndex < 0) {
        stackRemove(index);
      } else {
        handleUpdateKg(index, 0, itemIndex, undefined, false, true);
      }
    } else {
      remove(index);
    }
    onUpdateTotal();
  };

  const handleSubmit = async (values: InvoiceCreate) => {
    let message = "";
    try {
      const response = await invoiceRequest.create(values);
      message = response?.message || "Tạo đơn hàng thành công";
      form.reset();
    } catch (error) {
      console.error(error);
      message = "Có lỗi xảy ra trong quá trình tạo đơn hàng.";
    }
    toast({
      description: message,
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          className="mx-auto grid lg:max-w-[64rem] w-full flex-1 auto-rows-max gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex items-center gap-4">
            <Header />
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-6">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-6">
              <Items
                fields={fields}
                stackFields={stackFields}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
              <Total form={form} />
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-6">
              <Scan onAppend={onAppend} />
              <Customer />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Create;
