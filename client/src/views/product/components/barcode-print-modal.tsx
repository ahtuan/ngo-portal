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

import { ProductBarCode } from "@/schemas/product.schema";
import { formatPrice } from "@/lib/utils";
import { productRequest } from "@/api-requests/product.request";
import { useToast } from "@@/ui/use-toast";
import { Label } from "@@/ui/label";
import { Input } from "@@/ui/input";
import { Switch } from "@@/ui/switch";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: ProductBarCode;
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
  const [size, setSize] = useState<Size>(LabelSize.small);
  const [quantity, setQuantity] = useState<number>(product.quantity);
  const [printedLeft, setPrintedLeft] = useState<number>(product.quantity);
  const [isMultiple, setIsMultiple] = useState(false);

  const [includePrice, setIncludePrice] = useState<boolean | undefined>(
    product.isUsedCategoryPrice,
  );
  const { toast } = useToast();
  const onPrintBarcode = async () => {
    if (!product) {
      return;
    }
    try {
      await productRequest.print({
        byDateId: product.id,
        price: includePrice
          ? formatPrice(product.price) + (isMultiple ? "/Bộ" : "")
          : "",
        ...size,
        quantity: quantity,
      });
      const left = printedLeft - quantity;
      if (left > 0) {
        setPrintedLeft(left);
        setQuantity(left);
        setIncludePrice(true);
      } else {
        setIsOpen(false);
      }
    } catch (error) {
      // @ts-ignore
      let message = error.error ?? "Không thể in";
      toast({
        description: message,
      });
    }
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
  console.log("product", product);
  return (
    <Dialog open={isOpen} onOpenChange={onChangeDialog}>
      <DialogContent className="sm:max-w-[600px] gap-6">
        {mode === "alert" && (
          <DialogHeader>
            <DialogTitle>Thành công</DialogTitle>
            <DialogDescription>Tạo sản phẩm thành công</DialogDescription>
          </DialogHeader>
        )}
        <div className="grid grid-cols-2">
          <div>
            <Barcode value={product.id} displayValue={false} />
            <div className={"flex justify-between"}>
              <p>{product.id}</p>
              {includePrice && (
                <p className={"mr-16"}>
                  {formatPrice(product.price) + (isMultiple ? "/Bộ" : "")}
                </p>
              )}
            </div>
          </div>
          <div className="mb-3 grid gap-4">
            <div>
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                type="number"
                name="quantity"
                value={quantity}
                onChange={(event) => setQuantity(event.target.valueAsNumber)}
              />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="flex flex-col h-full space-y-2 pt-1.5">
                <Label htmlFor="includePrice">In giá</Label>
                <Switch
                  checked={includePrice}
                  onCheckedChange={setIncludePrice}
                  name="includePrice"
                />
              </div>
              <div className="flex flex-col h-full space-y-2 pt-1.5">
                <Label htmlFor="isMultiple">In theo bộ</Label>
                <Switch
                  checked={isMultiple}
                  onCheckedChange={setIsMultiple}
                  name="isMultiple"
                />
              </div>
            </div>
          </div>
        </div>
        <Button onClick={onPrintBarcode} disabled={!quantity}>
          In
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodePrintModal;
