"use client";

import React, { useCallback, useEffect } from "react";
import { TableCell, TableRow } from "@@/ui/table";
import ButtonAction from "@views/setting/category/components/button-action";
import Currency from "@@/currency";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@@/ui/input";
import { useForm } from "react-hook-form";
import { CategoryBody, CategoryType } from "@/schemas/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@@/ui/form";
import { categoryRequest } from "@/api-requests/category.request";
import { useToast } from "@@/ui/use-toast";
import { UNIT_ENUM } from "@/constants/enums";

type Props = {
  uuid: string;
  name: string;
  price: number;
  unit?: string;
  defaultMode?: boolean;
  handleCancelAddMore: () => void;
  upsertMutate: (upsert: CategoryType, isCreate: boolean) => Promise<void>;
  deleteMutate: (id: string) => Promise<void>;
};

const EditableRow = ({
  uuid,
  name,
  price,
  unit,
  defaultMode = false,
  handleCancelAddMore,
  upsertMutate,
  deleteMutate,
}: Props) => {
  const { toast } = useToast();
  const [isEdit, setIsEdit] = React.useState(defaultMode);
  const form = useForm<CategoryType>({
    resolver: zodResolver(CategoryBody),
    defaultValues: {
      uuid: "",
      name: "",
      price: 0,
      unit: UNIT_ENUM.PCS,
    },
  });

  const toggleEdit = useCallback(() => {
    setIsEdit(true);
    form.setValue("uuid", uuid);
    form.setValue("name", name);
    form.setValue("price", price);
    form.setValue("unit", unit);
  }, [form, uuid, name, price]);

  useEffect(() => {
    if (defaultMode) {
      toggleEdit();
    }
  }, [defaultMode, toggleEdit]);

  const toggleEditOff = () => setIsEdit(false);

  const handleOnComplete = async (values: CategoryType) => {
    // Due to type of Currency component was "text" for formatting, so
    // the value here will be a string. Must parse to number before validation
    form.setValue("price", +values.price);

    const idValidForm = await form.trigger(["name", "price"]);

    // If tick to submit when update but not change any field
    if (
      name === values.name &&
      price === +values.price &&
      idValidForm &&
      uuid
    ) {
      // check again
      toggleEditOff();
      handleCancelAddMore();
      return;
    }

    if (idValidForm) {
      try {
        const change = form.getValues();
        const response = await categoryRequest.upsert({
          ...change,
          unit: change.name.toUpperCase().includes(`(${UNIT_ENUM.KG})`)
            ? UNIT_ENUM.KG
            : UNIT_ENUM.PCS,
        });
        if (!response.data) {
          throw new Error("Có lỗi trong quá trình update dữ liệu");
        }
        toast({
          title: "Phân loại sản phẩm",
          description: response.message,
        });
        await upsertMutate(response.data, !values.uuid);
        toggleEditOff();
        handleCancelAddMore();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOnCancel = () => {
    toggleEditOff();
    form.reset();
    if (!form.getValues("uuid")) {
      handleCancelAddMore();
    }
  };
  const handleOnDelete = async () => {
    try {
      const { message } = await categoryRequest.delete(uuid);
      await deleteMutate(uuid);
      toast({
        title: "Phân loại sản phẩm",
        description: message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableRow>
      <Form {...form}>
        <TableCell>
          {isEdit && !uuid ? (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <span className="px-3">{name}</span>
          )}
        </TableCell>
        <TableCell>
          {isEdit ? (
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Currency {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <span className="px-3">{formatCurrency(price)}</span>
          )}
        </TableCell>
      </Form>
      <TableCell className="flex items-center">
        <ButtonAction
          isEdit={isEdit}
          toggleEdit={toggleEdit}
          onComplete={() => handleOnComplete(form.getValues())}
          onCancel={handleOnCancel}
          onDelete={handleOnDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default EditableRow;
