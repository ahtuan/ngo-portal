import React from "react";

import { ProductDetail } from "@/schemas/product.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@@/ui/dialog";
import Link from "next/link";
import { ProductPath } from "@/constants/path";
import { Button } from "@@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@@/ui/card";
import { Input } from "@@/ui/input";
import { Textarea } from "@@/ui/textarea";
import { Label } from "@@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/ui/select";
import { Switch } from "@@/ui/switch";
import Currency from "@@/currency";
import { ProductStatus } from "@/constants/status";
import DisplayImage from "@views/product/components/display-image";

type Props = {
  detailData?: ProductDetail;
  onClose?: () => void;
  onEdit?: () => void;
};

const View = ({ detailData, onClose, onEdit }: Props) => {
  const imageUrls = detailData?.imageUrls ?? [];
  const handleOnOpenChange = (value: boolean) => {
    if (!value) {
      onClose?.();
    }
  };

  if (!detailData) {
    return;
  }

  return (
    <Dialog open={!!detailData} onOpenChange={handleOnOpenChange}>
      <DialogContent className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
        <DialogHeader>
          <DialogTitle>Thông tin sản phẩm</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            {/*DetailModal*/}
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input value={detailData.name} readOnly name="name" />
                  </div>
                  <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea
                      value={detailData.description}
                      readOnly
                      name="description"
                      className="min-h-24"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Cân nặng (g)</Label>
                      <Input
                        value={detailData.weight * 1000}
                        readOnly
                        name="weight"
                        type="number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Số lượng (cái/chiếc))</Label>
                      <Input
                        value={detailData.quantity}
                        readOnly
                        name="quantity"
                        type="number"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/*Category*/}
            <Card>
              <CardHeader>
                <CardTitle>Phân loại sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="categoryName">Phân loại</Label>
                      <Input
                        value={detailData.categoryName}
                        readOnly
                        name="categoryName"
                      />
                    </div>
                    <div className="grid gap-3 sm:col-span-2">
                      <div className="flex justify-between items-center h-full">
                        <div className="grid gap-2">
                          <Label htmlFor="isUsedCategoryPrice">Đồng giá</Label>
                          <p className="text-muted-foreground text-sm">
                            Sử dụng giá của phân loại để làm giá sản phẩm
                          </p>
                        </div>
                        <Switch
                          checked={detailData.isUsedCategoryPrice}
                          disabled
                          name="isUsedCategoryPrice"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="price">Giá sản phẩm</Label>
                    <Currency value={detailData.price} readOnly name="price" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            {/*Status*/}
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select value={detailData.status} disabled name="status">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ProductStatus).map(
                          ({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/*Images*/}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Trực quan sản phẩm</CardTitle>
                <CardDescription>
                  Chỉ được phép upload tối đa 3 tấm hình
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <DisplayImage src={imageUrls[0]} height={300} width={300} />
                  <div className="grid grid-cols-3 gap-2">
                    <DisplayImage
                      src={imageUrls[1]}
                      width={84}
                      height={84}
                      hoverAble={true}
                    />
                    <DisplayImage
                      src={imageUrls[2]}
                      width={84}
                      height={84}
                      hoverAble={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center gap-4 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOnOpenChange(false)}
          >
            Đóng
          </Button>
          <Link href={`${ProductPath.Update(detailData.byDateId)}`}>
            <Button size="sm" onClick={onEdit}>
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default View;
