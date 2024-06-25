"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  ProductBarCode,
  ProductBody,
  ProductCreate,
  ProductDetail,
} from "@/schemas/product.schema";
import {
  productEndpoint as cacheKey,
  productRequest,
} from "@/api-requests/product.request";
import BarcodePrintModal from "@views/product/components/barcode-print-modal";
import { useToast } from "@@/ui/use-toast";
import { getDirtyValues } from "@/lib/utils";
import { ProductPath } from "@/constants/path";
import { mutate } from "swr";

export type CardItemProps = {
  form: UseFormReturn<ProductCreate>;
};

type Props = {
  detailData?: ProductDetail;
  mode?: "create" | "edit";
};
const Upsert = ({ detailData, mode = "create" }: Props) => {
  const inventory = useSearchParams().get("inventory") ?? "";
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<ProductCreate>({
    resolver: zodResolver(ProductBody),
    defaultValues: {
      name: detailData?.name ?? "",
      description: detailData?.description ?? "",
      price: detailData?.price ?? 0,
      weight: detailData?.weight ?? 0,
      status: detailData?.status ?? ProductStatus.Kho,
      categoryUuid:
        mode === "edit" ? detailData?.categoryUuid ?? OtherOption.uuid : "",
      categoryName: detailData?.categoryName ?? "",
      imageUrls: detailData?.imageUrls ?? [],
      isUsedCategoryPrice: detailData?.isUsedCategoryPrice ?? false,
    },
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [createdProduct, setCreatedProduct] = React.useState<ProductBarCode>();

  if (
    (!inventory && mode === "create") ||
    (mode === "edit" && !detailData?.inventoryId)
  ) {
    return <NoInventoryDialog />;
  }

  const handleSubmit = async (values: ProductCreate) => {
    console.log("values", values);
    try {
      if (mode === "create") {
        const createdData = await productRequest.create({
          ...values,
          inventoryId: inventory ?? "",
          categoryUuid:
            values.categoryUuid === OtherOption.uuid ? "" : values.categoryUuid,
        });
        if (createdData.data) {
          setCreatedProduct({
            id: createdData.data.byDateId,
            price: createdData.data.price,
          });
          form.reset();
          setIsOpen(true);
        } else {
          toast({
            description: createdData.message,
          });
        }
      } else {
        if (!detailData?.byDateId) {
          throw "Sản phẩm không có ID";
        }

        const payload = getDirtyValues<ProductCreate>(values, detailData);
        if (payload.categoryUuid) {
          payload.categoryUuid =
            payload.categoryUuid === OtherOption.uuid
              ? ""
              : values.categoryUuid;
        }
        const updatedData = await productRequest.update(
          detailData?.byDateId,
          payload,
        );
        if (updatedData.data) {
          await mutate(`${cacheKey}?page=1`);
          await mutate(
            `${cacheKey}/${updatedData.data.byDateId}`,
            updatedData.data,
          );
          router.push(`${ProductPath.Base}?page=1`);
        }
        toast({
          description: updatedData.message,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log(form.formState.errors);
  return (
    <>
      <Form {...form}>
        <form
          className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="flex items-center gap-4">
            <CreateHeader
              title={mode === "create" ? inventory : detailData?.inventoryId}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] md:grid-cols-3 md:gap-6 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 md:col-span-2 md:gap-6 lg:gap-8">
              <Detail form={form} />
              <Category form={form} />
            </div>
            <div className="grid auto-rows-max items-start gap-4  md:gap-6 lg:gap-8">
              <Status form={form} />
              <ImageUpload form={form} />
            </div>
          </div>
        </form>
      </Form>
      {isOpen && (
        <BarcodePrintModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          product={createdProduct}
          setProduct={setCreatedProduct}
        />
      )}
    </>
  );
};

export default Upsert;
