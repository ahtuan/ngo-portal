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
import { ToggleGroup, ToggleGroupItem } from "@@/ui/toggle-group";
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
  const [size, setSize] = useState<Size>({
    width: 30,
    height: 10,
  });
  const [quantity, setQuantity] = useState<number>(product.quantity);
  const [includePrice, setIncludePrice] = useState<boolean | undefined>(
    product.isUsedCategoryPrice,
  );
  const { toast } = useToast();
  const onPrintBarcode = async () => {
    if (!product) {
      return;
    }
    try {
      const response = await productRequest.print({
        byDateId: product.id,
        price: includePrice ? formatPrice(product.price) : "",
        ...size,
        quantity: quantity,
      });
      setQuantity(1);
      setIncludePrice(true);
    } catch (error) {
      // @ts-ignore
      let message = error.error ?? "Không thể in";
      toast({
        description: message,
      });
    }
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
        <div className="grid grid-cols-2">
          <Barcode value={product.id} />
          <div className="mb-3 grid gap-4">
            <div>
              <Label>Kích thước khổ in</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Số lượng</Label>
                <Input
                  type="number"
                  min={1}
                  name="quantity"
                  value={quantity}
                  onChange={(event) => setQuantity(+event.target.value)}
                />
              </div>
              <div className="flex flex-col h-full space-y-2 pt-1.5">
                <Label htmlFor="includePrice">In giá</Label>
                <Switch
                  checked={includePrice}
                  onCheckedChange={setIncludePrice}
                  name="includePrice"
                />
              </div>
            </div>
          </div>
        </div>
        <Button onClick={onPrintBarcode}>In</Button>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodePrintModal;
