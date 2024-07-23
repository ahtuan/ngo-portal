"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/schemas/invoice.schema";
import { Badge } from "@@/ui/badge";
import { PAYMENT_TYPE } from "@/constants/enums";
import { formatCurrency, formatDate } from "@/lib/utils";
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
import { CircleDashed, MoreHorizontal } from "lucide-react";
import DetailModal from "@views/order/detail-modal";
import { OrderStatus, PaymentStatus } from "@/constants/status";

const columns = (
  setByDateId: (byDateId: string) => void,
  refresh: () => void,
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

  return [
    {
      accessorKey: "byDateId",
      header: "Đơn hàng",
      enableHiding: false,
      cell: ({ row }) => {
        const { status, byDateId } = row.original;
        return (
          <div className="flex items-center">
            <CircleDashed
              className={`h-4 w-4 pr-1 ${
                status === OrderStatus.PENDING ? "visible" : "invisible"
              }`}
            />
            {byDateId}
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
        const { payments, isOnline, status } = row.original;

        if (payments && payments.length > 0) {
          if (!isOnline) {
            return getBadge(payments[0].paymentMethod);
          }
          if (payments[1].status === PaymentStatus.PENDING) {
            return "Còn lại - " + formatCurrency(payments[1].amount, "đ");
          }
          return "Đơn trực tuyến";
        }

        return;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { byDateId, status } = row.original;
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
              {status === OrderStatus.PENDING && (
                <DropdownMenuItem
                  onClick={() => completeOnlineInvoice(byDateId)}
                >
                  Hoàn tất
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
        columns={columns(setByDateId, refresh)}
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
    </>
  );
};

export default List;
