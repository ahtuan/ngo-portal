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
import { MoreHorizontal } from "lucide-react";
import DetailModal from "@views/order/detail-modal";

const columns = (
  setByDateId: (byDateId: string) => void,
): ColumnDef<Invoice.Type>[] => {
  return [
    {
      accessorKey: "byDateId",
      header: "Đơn hàng",
      enableHiding: false,
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
      accessorKey: "paymentMethod",
      header: "Cổng thanh toán",
      cell: ({ row }) => {
        const method = row.getValue("paymentMethod");
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
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { byDateId } = row.original;
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

  const { data: res, isLoading } = useSWR(
    queryString ? cacheKey + `?${queryString}` : null,
    invoiceRequest.getAll,
  );

  const { data: detailData } = useSWR(
    byDateId ? cacheKey + `/${byDateId}` : undefined,
    invoiceRequest.getDetail,
    {},
  );

  return (
    <>
      <DataTable<Invoice.Type>
        columnVisibility={{
          weight: false,
          categoryName: false,
        }}
        loading={isLoading}
        data={res?.data || []}
        columns={columns(setByDateId)}
        pagination={{
          page: res?.page,
          total: res?.totalRecord,
          totalPages: res?.totalPage,
        }}
      />
      {detailData && (
        <DetailModal data={detailData} onClose={() => setByDateId(undefined)} />
      )}
    </>
  );
};

export default List;
