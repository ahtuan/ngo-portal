"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@@/ui/dialog";
import Html5QrcodePlugin from "@@/Html5QrcodePlugin";
import useSWRMutation from "swr/mutation";
import { productRequest } from "@/api-requests/product.request";
import View from "@views/product/view";
import { useToast } from "@@/ui/use-toast";

type Props = {
  trigger?: React.ReactNode;
};

const Scan = ({ trigger }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewId, setViewId] = useState<string>();
  const { toast } = useToast();
  const {
    data,
    trigger: fetcher,
    reset,
  } = useSWRMutation(viewId ? viewId : undefined, productRequest.getDetail, {
    onError: (err, key, config) => {
      toast({
        description: err.message,
      });
    },
  });

  const onNewScanResult = (decodedText: string) => {
    if (decodedText && decodedText !== viewId) {
      setViewId(decodedText);
    }
  };

  const handleOnCloseView = () => {
    setViewId(undefined);
    reset();
  };

  const handleCloseOnEdit = () => {
    handleOnCloseView();
    setIsOpen(false);
  };

  useEffect(() => {
    if (viewId) {
      // @ts-ignore
      fetcher(viewId);
    }
  }, [viewId, fetcher]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Quét mã vạch</DialogTitle>
          <DialogDescription>
            Đưa mã vạch vào khung để quét và xem chi tiết sản phẩm
          </DialogDescription>
        </DialogHeader>
        {isOpen && (
          <Html5QrcodePlugin
            fps={10}
            disableFlip={true}
            qrCodeSuccessCallback={onNewScanResult}
            className="max-h-[40dvh]"
          />
        )}

        {data && (
          <View
            detailData={data}
            onClose={handleOnCloseView}
            onEdit={handleCloseOnEdit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Scan;
