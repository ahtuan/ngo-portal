"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import NoInventoryDialog from "@views/product/components/no-inventory-dialog";
import CreateHeader from "@views/product/components/create-header";
import Detail from "@views/product/components/detail";
import Category, { OtherOption } from "@views/product/components/category";
import Status from "@views/product/components/status";
import ImageUpload from "@views/product/components/image-upload";
import { Form } from "@@/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductStatus } from "@/constants/status";
import { ProductBody, ProductCreate } from "@/schemas/product.schema";
import { productRequest } from "@/api-requests/product.request";
import BarcodePrintModal from "@views/product/components/barcode-print-modal";

export type CardItemProps = {
  form: UseFormReturn<ProductCreate>;
};
const Create = () => {
  const inventory = useSearchParams().get("inventory");
  const form = useForm<ProductCreate>({
    resolver: zodResolver(ProductBody),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      weight: 0,
      status: ProductStatus.Kho,
      isArchived: false,
    },
  });

  const [isOpen, setIsOpen] = React.useState(false);
  if (!inventory) {
    return <NoInventoryDialog />;
  }

  const handleSubmit = async (values: ProductCreate) => {
    try {
      // const createdData = await productRequest.create({
      //   ...values,
      //   categoryUuid:
      //     values.categoryUuid === OtherOption.uuid ? "" :
      // values.categoryUuid, });
      form.reset();
      setIsOpen(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex items-center gap-4">
            <CreateHeader title={inventory} />
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Detail form={form} />
              <Category form={form} />
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Status form={form} />
              <ImageUpload form={form} />
            </div>
          </div>
        </form>
      </Form>
      {isOpen && <BarcodePrintModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  );
};

export default Create;
