"use client";

import { ToastAction } from "@@/ui/toast";
import { useToast } from "@@/ui/use-toast";
import Link from "next/link";
import { ProductPath } from "@/constants/path";
import React, { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import useSWR from "swr";
import {
  inventoryEndpoint,
  inventoryRequest,
} from "@/api-requests/inventory.request";

const cacheKey = inventoryEndpoint + "/detect-inspection";
const DetectInventory = () => {
  const { data: res } = useSWR(cacheKey, inventoryRequest.detectInspection, {
    onSuccess: (res) => {
      if (res.data) {
        toggleToast(res.data);
      }
    },
  });

  const { toast } = useToast();

  const toggleToast = (id: string) => {
    toast({
      title: "Phát hiện",
      description: "Có lô hàng vẫn cần được soạn",
      action: (
        <Link href={`${ProductPath.Create}?inventory=${id}`}>
          <ToastAction
            altText="Đến trang nhập sản phẩm"
            className="bg-primary text-primary-foreground shadow hover:bg-primary/90"
          >
            Nhập sản phẩm <ArrowUpRight className="h-4 w-4 ml-1" />
          </ToastAction>
        </Link>
      ),
    });
  };

  useEffect(() => {
    if (res?.data) {
      toggleToast(res.data);
    }
  }, []);

  return <></>;
};

export default DetectInventory;
