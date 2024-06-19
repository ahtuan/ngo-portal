"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { inventoryEndpoint as cacheKey } from "@/api-requests/inventory.request";
import Loading from "@@/loading";
import { productRequest } from "@/api-requests/product.request";
import { ProductType } from "@/schemas/product.schema";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatPrice } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { Button } from "@@/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ProductStatus } from "@/constants/status";
import DataTable from "@@/data-table";
import { Badge } from "@@/ui/badge";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const columns = (
  setUpdatedData: (data: ProductType) => void,
): ColumnDef<ProductType>[] => {
  return [
    {
      accessorKey: "mainImage",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const { mainImage, byDateId, price } = row.original;
        if (!mainImage) {
          return (
            <Image
              src="/images/placeholder.svg"
              width={32}
              height={32}
              alt="Product image"
              className="rounded"
            />
          );
        }
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Image
                src={mainImage}
                width={32}
                height={32}
                alt="Product image"
                className="rounded"
              />
            </HoverCardTrigger>
            <HoverCardContent side="right">
              <Image
                src={mainImage}
                width={32}
                height={32}
                alt="Product image"
                className="w-64 rounded"
              />
              <div className="flex justify-between mt-2">
                <p>{byDateId}</p>
                <p>{formatPrice(price)}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      accessorKey: "byDateId",
      header: "Mặt hàng",
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Tên sản phẩm",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status");
        const statusObj = Object.entries(ProductStatus).find(
          ([key, val]) => val === status,
        );
        let statusVal = status;
        if (statusObj) {
          const [key] = statusObj;
          statusVal = key;
        }
        return (
          <Badge variant="outline" className="ml-auto sm:ml-0">
            {statusVal as string}
          </Badge>
        );
      },
    },
    {
      accessorKey: "weight",
      header: "Cân nặng",
      cell: ({ row }) => {
        const { weight } = row.original;
        return formatCurrency(weight) + " kg";
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
      accessorKey: "categoryName",
      header: "Phân loại",
      cell: ({ row }) => {
        const { categoryName } = row.original;
        return categoryName ?? "Khác";
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
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
              <DropdownMenuItem>In mã vạch</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

const List = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [query, setQuery] = React.useState<{
    [p: string]: string;
  }>({});

  const getQueryString = (page?: number) => {
    return Object.entries(query)
      .map(([key, value]) => `${key}=${key === "page" && page ? page : value}`)
      .join("&");
  };
  const queryString = getQueryString();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setQuery(params);
  }, [searchParams]);

  const { data: res, isLoading } = useSWR(
    queryString ? cacheKey + `?${queryString}` : null,
    () => productRequest.getALL(queryString),
  );
  const [updatedData, setUpdatedData] = useState<ProductType>();

  if (isLoading) {
    return <Loading className="m-auto" />;
  }
  if (!res) {
    return null;
  }

  const onPageChange = (page: number) => {
    const queryString = Object.entries(query)
      .map(([key, value]) => `${key}=${key === "page" ? page : value}`)
      .join("&");
    router.push(`${pathName}?${queryString}`);
  };

  return (
    <>
      <DataTable<ProductType>
        data={res.data}
        columns={columns(setUpdatedData)}
        pagination={{
          page: res.page,
          total: res.totalRecord,
          totalPages: res.totalPage,
        }}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default List;
