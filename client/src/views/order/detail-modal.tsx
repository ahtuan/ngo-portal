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
import { OrderStatus, PaymentStatus } from "@/constants/status";
import { Badge } from "@@/ui/badge";
import { Separator } from "@@/ui/separator";

type Props = {
  data: Invoice.Detail;
  onClose: () => void;
};
const DetailModal = ({ data, onClose }: Props) => {
  const { isOnline } = data;
  const getDescription = () => {
    return `${isOnline && "Đơn trực truyến"} - ${data.byDateId} - ${formatDate(data.createdAt)}`;
  };

  const getPaymentType = (value?: string) => {
    const method = value ?? data.paymentType;
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
          <DialogTitle>
            Thông tin đơn hàng
            {data.status === OrderStatus.PENDING && (
              <Badge variant="outline" className="ml-1">
                Đang giao hàng
              </Badge>
            )}
          </DialogTitle>
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
              <div className="flex flex-col float-end">
                {formatCurrency(data.actualPrice, "đ")}
                <div className="!w-[10rem] mt-2">
                  <Separator />
                </div>
              </div>
            </RowRender>
            {isOnline && data.payments.length > 1 ? (
              <>
                <RowRender text="Cọc">
                  {getPaymentType(data.payments[0].paymentMethod) +
                    " - " +
                    formatCurrency(data.payments[0].amount, "đ")}
                </RowRender>
                <RowRender text="Còn lại">
                  {(data.payments[1].status === PaymentStatus.PENDING
                    ? "Đang chờ - "
                    : getPaymentType(data.payments[1].paymentMethod) + " - ") +
                    formatCurrency(data.payments[1].amount, "đ")}
                </RowRender>
              </>
            ) : (
              <RowRender text="Cổng thanh toán">
                {getPaymentType(data.payments[0].paymentMethod)}
              </RowRender>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
