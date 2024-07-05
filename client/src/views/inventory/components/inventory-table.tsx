"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InventoryType } from "@/schemas/inventory.schema";
import useSWR from "swr";
import {
  inventoryEndpoint as cacheKey,
  inventoryRequest,
} from "@/api-requests/inventory.request";
import DataTable from "@@/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { Button } from "@@/ui/button";
import { MoreHorizontal } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import UpsertModal from "@views/inventory/components/upsert-modal";
import dayjs from "dayjs";
import { InventoryStatus } from "@/constants/status";
import Loading from "@@/loading";
import Link from "next/link";
import { ProductPath } from "@/constants/path";

const columns = (
  setUpdatedData: (data: InventoryType) => void,
): ColumnDef<InventoryType>[] => {
  return [
    {
      accessorKey: "id",
      header: "Lô hàng",
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: "Mô tả",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const statusObj = Object.values(InventoryStatus).find(
          ({ value }) => value === status,
        );
        if (statusObj) {
          return statusObj.label;
        }
        return status;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => {
        return dayjs(row.getValue("createdAt")).format("YYYY-MM-DD HH:mm");
      },
    },
    {
      accessorKey: "grossWeight",
      header: "Cân nặng",
      cell: ({ row }) => {
        const { grossWeight, unit } = row.original;
        return formatCurrency(grossWeight) + " " + unit;
      },
    },
    {
      accessorKey: "actualWeight",
      header: "Cân nặng thực tế",
      cell: ({ row }) => {
        const { actualWeight, unit } = row.original;
        return (
          <p className="pl-10">
            {actualWeight ? formatCurrency(actualWeight) + " " + unit : "-"}
          </p>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => {
        return formatCurrency(row.getValue("price")) + " đ";
      },
    },
    {
      accessorKey: "source",
      header: "Nguồn hàng",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { status, id } = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setUpdatedData(row.original)}>
                Chỉnh sửa
              </DropdownMenuItem>
              {status === InventoryStatus.INSPECTION.value && (
                <DropdownMenuItem>
                  <Link href={`${ProductPath.Create}?inventory=${id}`}>
                    Nhập hàng
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem disabled>Huỷ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

const InventoryTable = () => {
  // TODO Pagination
  const { data, isLoading } = useSWR(cacheKey, inventoryRequest.getALL);
  const [updatedData, setUpdatedData] = useState<InventoryType>();

  if (isLoading) {
    return <Loading className="m-auto" />;
  }
  if (!data) {
    return null;
  }

  const onCancelInventory = async (id: string) => {};

  return (
    <>
      <DataTable<InventoryType> data={data} columns={columns(setUpdatedData)} />
      <UpsertModal data={updatedData} setUpdatedData={setUpdatedData} />
    </>
  );
};

export default InventoryTable;
