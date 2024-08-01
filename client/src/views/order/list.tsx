"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/schemas/invoice.schema";
import { Badge } from "@@/ui/badge";
import { PAYMENT_TYPE } from "@/constants/enums";
import { formatCurrency, formatDate, formatPrice } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import {
  invoiceEndpoint as cacheKey,
  invoiceRequest,
} from "@/api-requests/invoice.request";
import DataTable from "@@/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { Button } from "@@/ui/button";
import {
  CircleDashed,
  MoreHorizontal,
  PackageOpen,
  RotateCcw,
  Truck,
} from "lucide-react";
import DetailModal from "@views/order/detail-modal";
import { OrderStatus, PaymentStatus, PaymentType } from "@/constants/status";
import RefundModal from "@views/order/component/refund-modal";
import DeliveryModal from "@views/order/component/delivery-modal";

type RefundType = {
  byDateId: string;
  note?: string;
  amount: number;
};
const columns = (
  setByDateId: (byDateId: string) => void,
  refresh: () => void,
  setRefundData: (value?: RefundType) => void,
  setDelivery: (byDateId: string) => void,
): ColumnDef<Invoice.Type>[] => {
  const getBadge = (method: string) => {
    const methodObj = Object.values(PAYMENT_TYPE).find(
      ({ value }) => value === method,
    );
    let label = method;
    if (methodObj) {
      label = methodObj.label;
    }
    return (
      <Badge variant="outline" className="ml-auto sm:ml-0">
        {label as string}
      </Badge>
    );
  };

  const completeOnlineInvoice = async (byDateId: string) => {
    try {
      await invoiceRequest.complete(byDateId);
      await refresh();
    } catch {}
  };

  const iconShow = {
    PENDING: <CircleDashed className={`h-4 w-4 ml-1`} />,
    DELIVERING: <CircleDashed className={`h-4 w-4 ml-1`} />,
    REFUNDED: <RotateCcw className={`h-4 w-4 ml-1`} />,
    PREPARED: <PackageOpen className={`h-4 w-4 ml-1`} />,
  };

  return [
    {
      accessorKey: "byDateId",
      header: "Đơn hàng",
      enableHiding: false,
      cell: ({ row }) => {
        const { status, byDateId, isOnline } = row.original;
        return (
          <div className="flex items-center">
            {isOnline ? (
              <Truck className={`h-4 w-4 mr-1`} />
            ) : (
              <div className={`h-4 w-4 mr-1`} />
            )}
            {byDateId}
            <span className="text-muted-foreground">
              {
                iconShow[
                  status as "PENDING" | "DELIVERING" | "REFUNDED" | "PREPARED"
                ]
              }
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => {
        const { price } = row.original;
        return formatCurrency(price, "đ");
      },
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => {
        const { createdAt } = row.original;
        return formatDate(createdAt);
      },
    },
    {
      id: "payment",
      enableHiding: false,
      cell: ({ row }) => {
        const { payments, isOnline, status, note } = row.original;
        let statement = "";
        if (payments && payments.length > 0) {
          if (!isOnline) {
            return getBadge(payments[0].paymentMethod);
          }
          if (status === OrderStatus.DELIVERING) {
            statement += "Đang giao hàng ";
          } else if (status === OrderStatus.PREPARED) {
            statement += "Đang đóng gói ";
          } else if (status === OrderStatus.PENDING) {
            statement += "Đang giữ hàng";
          } else {
            statement += "Giao thành công";
          }

          const [sumPending, sumRefund] = payments.reduce(
            (prev, curr) => {
              let [pending, refund] = prev;
              if (
                curr.paymentType === PaymentType.REMAINING &&
                curr.status === PaymentStatus.PENDING
              ) {
                pending += curr.amount;
              } else if (curr.paymentType === PaymentType.REFUNDED) {
                refund += curr.amount;
              }
              return [pending, refund];
            },
            [0, 0],
          );

          if (sumPending) {
            statement += ` - Cần thanh toán: ${formatPrice(sumPending)}`;
          }
          if (sumRefund) {
            statement += ` - Hoàn tiền: ${formatPrice(sumRefund * -1)}`;
          }
        }

        return statement;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { byDateId, status, isOnline, price, note, payments } =
          row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setByDateId(byDateId)}>
                Chi tiết
              </DropdownMenuItem>
              {payments.some(
                (payment) => payment.status === PaymentStatus.PENDING,
              ) &&
                status !== OrderStatus.PREPARED && (
                  <DropdownMenuItem
                    onClick={() => completeOnlineInvoice(byDateId)}
                  >
                    Hoàn tất
                  </DropdownMenuItem>
                )}
              {isOnline &&
                ![
                  OrderStatus.REFUNDED.toString(),
                  OrderStatus.PREPARED,
                ].includes(status) && (
                  <DropdownMenuItem
                    onClick={() =>
                      setRefundData({ byDateId, note, amount: price })
                    }
                  >
                    Hoàn tiền
                  </DropdownMenuItem>
                )}
              {isOnline && status === OrderStatus.PREPARED && (
                <DropdownMenuItem onClick={() => setDelivery(byDateId)}>
                  Giao hàng
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

type Props = {
  queryString: string;
};
const List = ({ queryString }: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const [byDateId, setByDateId] = React.useState<string>();
  const [refundData, setRefundData] = React.useState<RefundType>();
  const [delivery, setDelivery] = React.useState<string>();
  const {
    data: res,
    isLoading,
    mutate,
  } = useSWR(
    queryString ? cacheKey + `?${queryString}` : null,
    invoiceRequest.getAll,
  );

  const { data: detailData } = useSWR(
    byDateId ? cacheKey + `/${byDateId}` : undefined,
    invoiceRequest.getDetail,
    {},
  );

  const refresh = () => {
    mutate();
  };

  const onPageChange = (page: number) => {
    const pageChangeString = queryString
      .split("&")
      .map((query) => (/^page=/.test(query) ? `page=${page}` : query))
      .join("&");
    router.push(`${pathName}?${pageChangeString}`);
  };
  return (
    <>
      <DataTable<Invoice.Type>
        columnVisibility={{
          weight: false,
          categoryName: false,
        }}
        loading={isLoading}
        data={res?.data || []}
        columns={columns(setByDateId, refresh, setRefundData, setDelivery)}
        pagination={{
          page: res?.page,
          total: res?.totalRecord,
          totalPages: res?.totalPage,
        }}
        onPageChange={onPageChange}
      />
      {detailData && (
        <DetailModal data={detailData} onClose={() => setByDateId(undefined)} />
      )}
      {refundData && (
        <RefundModal
          {...refundData}
          onClose={() => setRefundData(undefined)}
          refresh={refresh}
        />
      )}
      {delivery && (
        <DeliveryModal
          byDateId={delivery}
          onClose={() => setDelivery(undefined)}
          refresh={refresh}
        />
      )}
    </>
  );
};

export default List;
