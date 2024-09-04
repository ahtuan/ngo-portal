"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/schemas/invoice.schema";
import { Badge } from "@@/ui/badge";
import { PAYMENT_TYPE } from "@/constants/enums";
import {
  formatCurrency,
  formatDate,
  formatPrice,
  getQueryChanged,
} from "@/lib/utils";
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
import { FacetedFilter } from "@@/data-table/faceted-filter";
import { Cross2Icon } from "@radix-ui/react-icons";
import { SearchParamsProps } from "@/app/(dashboard)/order/page";
import Search from "@@/data-table/search";
import DatePicker from "@@/date-picker";
import { DateRange } from "react-day-picker";
import KeepModal from "@views/order/component/keep-modal";
import Link from "next/link";
import { OrderPath } from "@/constants/path";

type RefundType = {
  byDateId: string;
  note?: string;
  amount: number;
};

type KeepType = {
  byDateId: string;
  note?: string;
};

const columns = (
  setByDateId: (byDateId: string) => void,
  refresh: () => void,
  setRefundData: (value?: RefundType) => void,
  setDelivery: (byDateId: string) => void,
  setKeepData: (value?: KeepType) => void,
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

  const completeOnlineInvoice = async (
    byDateId: string,
    justPayment?: boolean,
  ) => {
    try {
      if (justPayment) {
        await invoiceRequest.completePayment(byDateId);
      } else {
        await invoiceRequest.complete(byDateId);
      }
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
          if (status === OrderStatus.DELIVERING.value) {
            statement += "Đang giao hàng ";
          } else if (status === OrderStatus.PREPARED.value) {
            statement += "Đang đóng gói ";
          } else if (status === OrderStatus.PENDING.value) {
            statement += "Đang giữ hàng " + " - " + note;
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
              {[OrderStatus.PREPARED.value, OrderStatus.PENDING.value].includes(
                status,
              ) && (
                <DropdownMenuItem>
                  <Link href={OrderPath.Update(byDateId)}>Chỉnh sửa</Link>
                </DropdownMenuItem>
              )}
              {((payments.some(
                (payment) => payment.status === PaymentStatus.PENDING,
              ) &&
                ![
                  OrderStatus.PREPARED.value,
                  OrderStatus.REFUNDED.value,
                  OrderStatus.CANCELLED.value,
                ].includes(status)) ||
                status === OrderStatus.DELIVERING.value) && (
                <DropdownMenuItem
                  onClick={() => completeOnlineInvoice(byDateId)}
                >
                  Hoàn tất đơn hàng
                </DropdownMenuItem>
              )}
              {payments.some(
                (payment) => payment.status === PaymentStatus.PENDING,
              ) &&
                ![
                  OrderStatus.CANCELLED.value,
                  OrderStatus.COMPLETED.value,
                ].includes(status) && (
                  <DropdownMenuItem
                    onClick={() => completeOnlineInvoice(byDateId, true)}
                  >
                    Hoàn tất thanh toán
                  </DropdownMenuItem>
                )}
              {status === OrderStatus.PREPARED.value && (
                <DropdownMenuItem
                  onClick={() => setKeepData({ byDateId, note })}
                >
                  Giữ hàng
                </DropdownMenuItem>
              )}
              {isOnline &&
                ![
                  OrderStatus.REFUNDED.value.toString(),
                  OrderStatus.PREPARED.value,
                  OrderStatus.PENDING.value,
                ].includes(status) && (
                  <DropdownMenuItem
                    onClick={() =>
                      setRefundData({ byDateId, note, amount: price })
                    }
                  >
                    Hoàn tiền
                  </DropdownMenuItem>
                )}
              {isOnline &&
                [
                  OrderStatus.PREPARED.value,
                  OrderStatus.PENDING.value,
                ].includes(status) && (
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
  searchParams: SearchParamsProps;
};
const List = ({ queryString, searchParams }: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const [byDateId, setByDateId] = React.useState<string>();
  const [refundData, setRefundData] = React.useState<RefundType>();
  const [delivery, setDelivery] = React.useState<string>();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: searchParams.from ? new Date(searchParams.from) : undefined,
    to: searchParams.to ? new Date(searchParams.to) : undefined,
  });
  const [keepData, setKeepData] = React.useState<KeepType>();

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

  const refresh = async () => {
    await mutate();
  };

  const handleReset = () => {
    router.push(`${pathName}`);
  };

  const onPageChange = (page: number) => {
    const pageChangeString = queryString
      .split("&")
      .map((query) => (/^page=/.test(query) ? `page=${page}` : query))
      .join("&");
    router.push(`${pathName}?${pageChangeString}`);
  };

  const onFilter = (name: string, value: string[]) => {
    const queryChangedString = getQueryChanged(name, value, queryString);
    router.push(`${pathName}?${queryChangedString}`);
  };

  const onDateChange = (range: DateRange | undefined) => {
    if (range) {
      if (range.from && !range.to) {
        range.to = range.from;
      } else if (range.to && (!range.from || isNaN(range.from.getTime()))) {
        // invalid date
        range.from = range.to;
      }
    }

    setDateRange(range);
    const formatRange = {
      from: formatDate(range?.from, "YYYY-MM-DD", true),
      to: formatDate(range?.to, "YYYY-MM-DD", true),
    };
    let pageChangeString = queryString
      .split("&")
      .map((query) => {
        if (!/^from|to=/.test(query)) {
          return query;
        }
        if (range?.from && /^from=/.test(query)) {
          return `from=${formatRange?.from}`;
        } else if (range?.to && /^to=/.test(query)) {
          return `to=${formatRange?.to}`;
        }
        return "";
      })
      .filter(Boolean);

    if (
      formatRange.from &&
      !pageChangeString.some((query) => /^from=/.test(query))
    ) {
      pageChangeString.push("from=" + formatRange.from);
    }
    if (
      formatRange.to &&
      !pageChangeString.some((query) => /^to=/.test(query))
    ) {
      pageChangeString.push("to=" + formatRange.to);
    }

    router.push(`${pathName}?${pageChangeString.join("&")}`);
  };
  return (
    <>
      <DataTable<Invoice.Type>
        allowManualHide={false}
        loading={isLoading}
        data={res?.data || []}
        columns={columns(
          setByDateId,
          refresh,
          setRefundData,
          setDelivery,
          setKeepData,
        )}
        pagination={{
          page: res?.page,
          total: res?.totalRecord,
          totalPages: res?.totalPage,
        }}
        onPageChange={onPageChange}
        search={
          <Search
            value={searchParams.keyword}
            placeholder="Nhập mã hoặc mã vận"
            className="w-52"
            onSearch={(value) => onFilter("keyword", [value])}
          />
        }
        filter={
          <div className="flex gap-2 flex-col sm:flex-row">
            <DatePicker
              mode="range"
              value={
                dateRange?.from && dateRange?.to
                  ? `Từ: ${formatDate(
                      dateRange?.from,
                      "YYYY-MM-DD",
                      true,
                    )} - Đến: ${formatDate(dateRange?.to, "YYYY-MM-DD", true)}`
                  : ""
              }
              relative={true}
              selected={dateRange}
              onSelect={onDateChange}
              disabled={(date) => date > new Date()}
            />
            <div className="flex gap-2">
              <FacetedFilter
                options={[
                  { label: "Tất cả", value: "all" },
                  { label: "Đơn trực tuyến", value: "true" },
                  { label: "Đơn trực tiếp", value: "false" },
                ]}
                selectedValues={[searchParams.isOnline]}
                title="Phân loại"
                onFilter={(value) => onFilter("isOnline", value)}
                mode="single"
              />
              <FacetedFilter
                options={Object.values(OrderStatus)}
                selectedValues={
                  searchParams.status?.split(";")?.filter(Boolean) || []
                }
                title="Trạng thái"
                onFilter={(value) => onFilter("status", value)}
              />

              {(searchParams.status ||
                searchParams.keyword ||
                searchParams.isOnline) && (
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="h-8 px-2 lg:px-3"
                >
                  Bỏ lọc
                  <Cross2Icon className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        }
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
      {keepData && (
        <KeepModal
          {...keepData}
          onClose={() => setKeepData(undefined)}
          refresh={refresh}
        />
      )}
    </>
  );
};

export default List;
