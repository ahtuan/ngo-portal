"use client";

import React, { useEffect } from "react";
import { TableCell, TableRow } from "@@/ui/table";
import ButtonAction from "@views/product/category/button-action";
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
} from "@/components/ui/form";
import { categoryRequest } from "@/api-requests/category.request";
import { useToast } from "@@/ui/use-toast";

type Props = {
  uuid: string;
  name: string;
  price: number;
  defaultMode?: boolean;
  handleCancelAddMore: () => void;
  upsertMutate: (upsert: CategoryType, isCreate: boolean) => Promise<void>;
  deleteMutate: (id: string) => Promise<void>;
};

const EditableRow = ({
  uuid,
  name,
  price,
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
    },
  });

  useEffect(() => {
    if (defaultMode) {
      toggleEdit();
    }
  }, [defaultMode]);
  const toggleEdit = () => {
    setIsEdit(true);
    form.setValue("uuid", uuid);
    form.setValue("name", name);
    form.setValue("price", price);
  };

  const toggleEditOff = () => setIsEdit(false);
  const handleOnComplete = async (values: CategoryType) => {
    // Due to type of Currency component was "text" for formatting, so
    // the value here will be a string. Must parse to number before validation
    form.setValue("price", +values.price);
    const idValidForm = await form.trigger(["name", "price"]);

    if (!form.formState.isDirty && idValidForm) {
      toggleEditOff();
      handleCancelAddMore();
      return;
    }

    if (idValidForm) {
      try {
        const response = await categoryRequest.upsert(form.getValues());
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
          {isEdit ? (
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
      <TableCell>
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
