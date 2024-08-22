"use client";

import React from "react";
import { Form } from "@@/ui/form";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import Header from "./component/header";
import Scan from "@views/order/component/scan";
import Customer from "@views/order/component/customer";
import Items from "@views/order/component/items";
import Total from "@views/order/component/total";
import { Invoice, InvoiceBody } from "@/schemas/invoice.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PAYMENT_TYPE } from "@/constants/enums";
import { ProductDetail } from "@/schemas/product.schema";
import { useToast } from "@@/ui/use-toast";
import { evaluateExp, fixed } from "@/lib/utils";
import {
  invoiceEndpoint,
  invoiceRequest,
} from "@/api-requests/invoice.request";
import useSWR, { mutate } from "swr";
import {
  saleEndpoint as cacheKey,
  saleRequest,
} from "@/api-requests/sale.request";
import { ClientSale } from "@/schemas/sale.schema";
import { OrderPath } from "@/constants/path";
import { useRouter } from "next/navigation";

export type CreateOrderProps = {
  form: UseFormReturn<Invoice.DedicatedCreated>;
};
type CreateProps = {
  isOnline?: boolean;
  byDateId?: string;
  data?: Invoice.Detail;
};

const Upsert = ({ isOnline, byDateId, data }: CreateProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const { data: invoiceSales } = useSWR(
    cacheKey + "/valid-sale",
    saleRequest.getForInvoiceOnly,
  );
  const form = useForm<Invoice.DedicatedCreated>({
    resolver: zodResolver(InvoiceBody),
    defaultValues: {
      items: data?.items || [],
      paymentType: isOnline ? PAYMENT_TYPE.BANK.value : PAYMENT_TYPE.CASH.value,
      actualPrice: data?.actualPrice || 0,
      stacks: data?.stacks || [],
      sale: data?.sale,
      isOnline: isOnline,
      deposit: isOnline ? 50000 : undefined,
      totalPrice: data?.totalPrice || 0,
      totalQuantity: data?.totalQuantity || 0,
      afterSale: data?.afterSale || 0,
      payments: data?.payments,
      totalCost: data?.totalCost || 0,
    },
  });
  const { control } = form;
  const { fields, append, remove, update } = useFieldArray({
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
        afterSale: total,
      };
    }
    console.error("Must have stock for PSC change");
    return;
  };

  const onUpdateTotal = () => {
    const itemsList = form.getValues("items");
    const stackList = form.getValues("stacks") || [];
    let totalCost = 0;
    const [pcsQuantity, pcsPrice] = itemsList.reduce(
      (previousValue, currentValue) => {
        let [quantity, total] = previousValue;

        quantity += currentValue.quantity;
        total += currentValue.afterSale;
        totalCost += currentValue.cost * currentValue.quantity;
        return [quantity, total];
      },
      [0, 0],
    );

    const [kgQuantity, kgPrice] = stackList.reduce(
      (previousValue, currentValue) => {
        let [quantity, total] = previousValue;
        quantity += currentValue.items.reduce((prev, current) => {
          totalCost += current.cost * current.quantity;
          return prev + current.quantity;
        }, 0);
        total += currentValue.afterSale;
        return [quantity, total];
      },
      [0, 0],
    );
    const totalPrice = pcsPrice + kgPrice;
    form.setValue("totalCost", totalCost);
    const availableSale = invoiceSales
      ?.filter((sale) =>
        evaluateExp(sale.condition, {
          price: totalPrice,
        }),
      )
      .reduce((previousValue, currentValue) => {
        const prevPrice =
          evaluateExp(previousValue.steps, {
            price: totalPrice,
          }) || totalPrice;
        const currentPrice =
          evaluateExp(currentValue.steps, {
            price: totalPrice,
          }) || totalPrice;
        if (currentPrice <= prevPrice) {
          return {
            ...currentValue,
            price: fixed(currentPrice, 0),
            isApplied: true,
          };
        }
        return previousValue;
      }, {} as ClientSale.Item);

    form.setValue("totalQuantity", pcsQuantity + kgQuantity);
    form.setValue("totalPrice", totalPrice);
    if (availableSale && availableSale.price) {
      form.setValue("sale", availableSale);
      availableSale.price && form.setValue("afterSale", availableSale.price);
      form.setValue("actualPrice", availableSale.price);
    } else {
      form.setValue("afterSale", totalPrice);
      form.setValue("sale", undefined);
      form.setValue("actualPrice", totalPrice);
    }
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
      newWeight = replace ? value : existing.weight + value;
    }
    // Item not be in stack list
    else if (itemIndex === -1) {
      if (addedItem) {
        newWeight = existing.weight + addedItem.weight;
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
        newWeight = existing.weight - item.weight * item.quantity;
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
          newWeight =
            existing.weight +
            (replace ? value - item.quantity : value) * item.weight;
          item.quantity = updatedItem.quantity;
          item.total = updatedItem.total;
          item.stock = updatedItem.stock;
        } else {
          return;
        }
      }
    }

    total = fixed(newWeight * existing.price, 0);
    const isSaleApplied = !!evaluateExp(existing?.sale?.condition, {
      quantity: newWeight,
    });

    const totalAfterSale = isSaleApplied
      ? evaluateExp(existing.sale?.steps, {
          quantity: newWeight,
          price: existing.price,
        }) || total // set default with total if not calculated
      : total;
    stackUpdate(index, {
      ...existing,
      weight: newWeight,
      total,
      afterSale: fixed(totalAfterSale, 0),
      sale: existing.sale
        ? { ...existing.sale, isApplied: isSaleApplied }
        : undefined,
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
      image: data.imageUrls?.[0] || "/images/placeholder.svg",
      cost: data.cost,
    };
    if (data.categoryUuidByKg) {
      const index = stackFields.findIndex(
        (item) => item.name === data.categoryNameByKg,
      );
      // If stack (by category) never be in the list
      // and then add the new one for stack with first item got from data
      const total = fixed(data.weight * data.price, 0);
      const newItem: Invoice.ItemType = {
        ...general,
        quantity: 1,
        total: total,
        afterSale: total,
      };
      if (index === -1) {
        const isSaleApplied = !!evaluateExp(data?.sale?.condition, {
          quantity: data.weight,
        });

        const totalAfterSale = isSaleApplied
          ? evaluateExp(data.sale?.steps, {
              quantity: data.weight,
              price: data.price,
            }) || total // set default with total if not calculated
          : total;

        stackAppend({
          categoryUuidByKg: data.categoryUuidByKg,
          name: data.categoryNameByKg || "Gốm kg",
          price: data.price,
          weight: data.weight,
          total: total,
          items: [newItem],
          afterSale: totalAfterSale,
          sale: data.sale
            ? { ...data.sale, isApplied: isSaleApplied }
            : undefined,
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
      // Handle for PCS items added
      const index = fields.findIndex((item) => item.byDateId === data.byDateId);
      if (index === -1) {
        if (data.quantity == 1) {
          // no sale anymore if they are unique
          data.sale = undefined;
        }
        const isSaleApplied = !!evaluateExp(data?.sale?.condition, {
          quantity: 1,
          stock: general.stock,
        });

        const total = data.price;
        append({
          ...general,
          quantity: 1,
          total,
          sale: data.sale
            ? { ...data.sale, isApplied: isSaleApplied }
            : undefined,
          afterSale: isSaleApplied
            ? evaluateExp(data.sale?.steps, {
                quantity: data.weight,
                price: data.price,
              }) || total // set default with total if not calculated
            : total,
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
    isChangeTotal?: boolean,
  ) => {
    if (isChangeTotal) {
      onChangeTotal(index, value);
    } else {
      if (byKg) {
        handleUpdateKg(index, value, itemIndex, undefined, true);
      } else {
        handleUpdatePcs(index, value, true);
      }
    }
    onUpdateTotal();
  };

  const onChangeTotal = (index: number, total: number) => {
    const item = fields[index];
    if (item) {
      const price = fixed(total / item.quantity, 0);
      const newItem = {
        ...item,
        total,
        price,
        afterSale: total,
      };
      update(index, newItem);
    }
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

  const handleSubmit = async (values: Invoice.RawCreate) => {
    let message = "";

    try {
      if (values.stacks?.length || values.items.length) {
        if (byDateId) {
          const response = await invoiceRequest.update(byDateId, values);
          message = response?.message || "Chỉnh sửa đơn hàng thành công";
        } else {
          const response = await invoiceRequest.create(values);
          message = response?.message || "Tạo đơn hàng thành công";
        }

        form.reset();
        await mutate(`${invoiceEndpoint}?page=1`);
        if (byDateId) {
          router.push(`${OrderPath.Base}?page=1`);
        }
      } else {
        message = "Đơn phải có sản phẩm";
      }
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
            <Header isOnline={isOnline} />
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-6">
            <Scan onAppend={onAppend} />
            <Customer />
            <Total form={form} isOnline={isOnline} isEdited={!!byDateId} />
          </div>
          <Items
            fields={fields}
            stackFields={stackFields}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </form>
      </Form>
    </>
  );
};

export default Upsert;
