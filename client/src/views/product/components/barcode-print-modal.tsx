import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@@/ui/dialog";
import Barcode from "react-barcode";
import { Button } from "@@/ui/button";

import { DTPWeb } from "dtpweb";
import { ProductBarCode } from "@/schemas/product.schema";
import { ToggleGroup, ToggleGroupItem } from "@@/ui/toggle-group";
import { formatPrice } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product?: ProductBarCode;
  setProduct: (product?: ProductBarCode) => void;
  mode?: "print" | "alert";
};

type Size = {
  width: number;
  height: number;
};

const LabelSize = {
  small: {
    width: 30,
    height: 10,
  },
  medium: {
    width: 50,
    height: 30,
  },
};

const BarcodePrintModal = ({
  isOpen,
  setIsOpen,
  product,
  setProduct,
  mode = "alert",
}: Props) => {
  const [size, setSize] = useState<Size>({
    width: 30,
    height: 10,
  });
  const onPrintBarcode = async () => {
    if (!product) {
      return;
    }
    const api = await DTPWeb.getInstance();
    DTPWeb.checkServer((value) => {
      if (!value) {
        alert("No Detected DothanTech Printer Helper!");
      }
    });

    const printerName = "P2 Label Printer";
    const text = product?.id;
    const margin = 1;
    if (!api) {
      return;
    }
    api.openPrinter((success) => {
      if (success) {
        api.startJob({
          printerName,
          ...size,
        });
        api.draw1DBarcode({
          text,
          width: size.width,
          height: size.height - margin * 4,
          x: 2,
          y: margin,
          barcodeType: 28,
        });
        const textPrice = formatPrice(product.price);
        api.drawText({
          text: text,
          x: size.width - 2 * margin,
          y: 7,
          fontName: "Arial",
          fontHeight: 2,
          horizontalAlignment: 2,
        });
        api.drawText({
          text: textPrice,
          x: margin,
          y: 7,
          fontName: "Arial",
          fontHeight: 2,
        });
        api.commitJob(() => {
          api.closePrinter();
          onChangeDialog(false);
        });
      }
    });
  };

  const getSizeComponent = (size: Size) => {
    return (
      <>
        <p>Chiều dài: {size.width}</p>&nbsp;-&nbsp;
        <p>Chiều rộng: {size.height}</p>
      </>
    );
  };

  const onChangeDialog = (open: boolean) => {
    if (!open) {
      setProduct();
    }
    setIsOpen(open);
  };

  if (!product) {
    return;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChangeDialog}>
      <DialogContent className="sm:max-w-[600px] gap-6">
        {mode === "alert" && (
          <DialogHeader>
            <DialogTitle>Thành công</DialogTitle>
            <DialogDescription>
              Tạo sản phẩm thành công với mã:{" "}
              <span className="font-semibold">{product.id}</span>
            </DialogDescription>
          </DialogHeader>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Barcode value={product.id} />
          <div>
            <p className="mb-3 pl-4 text-sm text-mute-foreground">
              Kích thước khổ in
            </p>
            <ToggleGroup
              type="single"
              defaultValue="small"
              variant="outline"
              className="flex flex-col gap-4"
            >
              {Object.entries(LabelSize).map(([key, size]) => (
                <ToggleGroupItem key={key} value={key} className="p-4">
                  {getSizeComponent(size)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        <Button onClick={onPrintBarcode}>In</Button>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodePrintModal;
