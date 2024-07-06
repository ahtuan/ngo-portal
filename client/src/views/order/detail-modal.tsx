import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@@/ui/dialog";
import { Invoice } from "@/schemas/invoice.schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import Items from "@views/order/component/items";
import { RowRender } from "@views/order/component/total";
import { Card, CardContent } from "@@/ui/card";
import { PAYMENT_TYPE } from "@/constants/enums";

type Props = {
  data: Invoice.Detail;
  onClose: () => void;
};
const DetailModal = ({ data, onClose }: Props) => {
  const getDescription = () => {
    return `${data.byDateId} - ${formatDate(data.createdAt)}`;
  };

  const getPaymentType = () => {
    const method = data.paymentType;
    const methodObj = Object.values(PAYMENT_TYPE).find(
      ({ value }) => value === method,
    );
    let label = method;
    if (methodObj) {
      label = methodObj.label;
    }
    return label;
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[70dvw]">
        <DialogHeader>
          <DialogTitle>Thông tin đơn hàng </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <Items
          fields={data.items}
          stackFields={data.stacks || []}
          readOnly={true}
        />
        <Card>
          <CardContent className="grid gap-2 mt-4">
            <RowRender text="Tổng số lượng">{data.totalQuantity}</RowRender>
            <RowRender text="Thành tiền">
              {formatCurrency(data.totalPrice, "đ")}
            </RowRender>
            <RowRender text="Thực thu">
              {formatCurrency(data.actualPrice, "đ")}
            </RowRender>
            <RowRender text="Cổng thanh toán">{getPaymentType()}</RowRender>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
