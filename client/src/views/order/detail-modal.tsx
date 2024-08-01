import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@@/ui/dialog";
import { Invoice } from "@/schemas/invoice.schema";
import { formatCurrency, formatDate, formatDateFromUTC } from "@/lib/utils";
import Items from "@views/order/component/items";
import { RowRender } from "@views/order/component/total";
import { Card, CardContent, CardHeader } from "@@/ui/card";
import { PAYMENT_TYPE } from "@/constants/enums";
import { OrderStatus } from "@/constants/status";
import { Badge } from "@@/ui/badge";
import { Separator } from "@@/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@@/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@@/ui/accordion";

type Props = {
  data: Invoice.Detail;
  onClose: () => void;
};
const DetailModal = ({ data, onClose }: Props) => {
  const { isOnline } = data;
  const getDescription = () => {
    return `${
      isOnline ? "Đơn trực truyến - " : ""
    }${data.byDateId} - ${formatDate(data.createdAt)}`;
  };

  const getPaymentMethod = (value?: string) => {
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
  const getPaymentType = (value?: string) => {
    let type = "";
    switch (value) {
      case "DEPOSIT":
        type = "Cọc";
        break;
      case "REFUNDED":
        type = "Hoàn tiền";
        break;
      case "REMAINING":
        type = "Cần thanh toán";
        break;
      case "SHIPPING_FEE":
        type = "Vận chuyển";
        break;
      default:
        type = "Trả hết";
    }
    return type;
  };

  const getDeliveryStatus = (value: string) => {
    let status = "";
    switch (value.toLowerCase()) {
      case "picking":
        status = "Đang lấy hàng";
        break;
      case "pick":
        status = "Lấy hàng";
        break;
      case "picked":
        status = "Đã lấy hàng";
        break;
      case "ready_to_pick":
        status = "Chờ lấy hàng";
        break;
      case "storing":
        status = "Đang chuyển kho";
        break;
      case "returned":
        status = "Trả hàng";
        break;
      case "deliver":
        status = "Giao hàng";
        break;
      case "delivered":
        status = "Đã giao hàng";
        break;
      case "transfer":
        status = "Đã chuyển tiền";
        break;
      default:
        status = "";
    }
    return status;
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[70dvw] max-h-[95dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Thông tin đơn hàng
            {[
              OrderStatus.PENDING.toString(),
              OrderStatus.DELIVERING,
              OrderStatus.PREPARED,
            ].includes(data.status) && (
              <Badge variant="outline" className="ml-1">
                Đang giao hàng
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        {isOnline && data.orderCode && (
          <Accordion type="single" collapsible>
            <AccordionItem value={data.orderCode}>
              <AccordionTrigger className="p-0">
                Mã vận đơn: {data.orderCode}
              </AccordionTrigger>
              <AccordionContent>
                {data.deliveryInfo && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <Card>
                        <CardHeader className="py-2 font-semibold">
                          Thông tin đơn hàng
                        </CardHeader>
                        <CardContent className="space-y-1">
                          <RowRender text="Ngày lấy hàng dự kiến">
                            {formatDateFromUTC(
                              data.deliveryInfo.expectedPickup,
                              "ddd, YYYY-MM-DD HH:mm",
                            )}
                          </RowRender>
                          <RowRender text="Ngày giao hàng dự kiến">
                            {formatDateFromUTC(
                              data.deliveryInfo.expectedDelivery,
                              "ddd, YYYY-MM-DD HH:mm",
                            )}
                          </RowRender>
                          <RowRender text="Trạng thái hiện tại">
                            <Badge variant="outline" className="mr-1">
                              {getDeliveryStatus(data.deliveryInfo.status)}
                            </Badge>
                          </RowRender>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2 font-semibold">
                          Người nhận
                        </CardHeader>
                        <CardContent className="space-y-1">
                          <RowRender text="Tên" align="items-start">
                            {data.deliveryInfo.toName}
                          </RowRender>
                          <RowRender text="Điện thoại">
                            {data.deliveryInfo.toPhone}
                          </RowRender>
                          <RowRender text="Địa chỉ" align="items-start">
                            {data.deliveryInfo.toAddress}
                          </RowRender>
                        </CardContent>
                      </Card>
                    </div>
                    {data.deliveryInfo.pods && (
                      <Card className="mt-4">
                        <CardHeader className="py-2 font-semibold">
                          Lịch sử
                        </CardHeader>
                        <CardContent className="space-y-1">
                          <Table>
                            <TableBody>
                              {data.deliveryInfo.pods.map((pod, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {getDeliveryStatus(pod.type)}
                                  </TableCell>
                                  <TableCell>
                                    {formatDateFromUTC(
                                      pod.time,
                                      "ddd, YYYY-MM-DD HH:mm",
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
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
                <div className="text-sm flex items-center">Dòng tiền</div>
                <Table>
                  <TableBody>
                    {data.payments.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {formatDate(item.paymentDate) || "-"}
                        </TableCell>
                        <TableCell>
                          {getPaymentType(item.paymentType)}
                        </TableCell>

                        <TableCell>
                          {item.paymentDate ? (
                            <Badge variant="outline" className="mr-1">
                              {getPaymentMethod(item.paymentMethod)}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        <TableCell className={"text-right"}>
                          {formatCurrency(item.amount, "đ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <RowRender text="Cổng thanh toán">
                {getPaymentMethod(data.payments[0].paymentMethod)}
              </RowRender>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
