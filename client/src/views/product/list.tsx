"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { inventoryEndpoint as cacheKey } from "@/api-requests/inventory.request";
import Loading from "@@/loading";
import { productRequest } from "@/api-requests/product.request";
import { ProductBarCode, ProductType } from "@/schemas/product.schema";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatPrice, generateSearchParams } from "@/lib/utils";
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
import { usePathname, useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Search from "@@/data-table/search";
import { SearchParamsProps } from "@/app/(dashboard)/product/page";
import {
  categoryEndpoint as categoryCacheKey,
  categoryRequest,
} from "@/api-requests/category.request";
import { FacetedFilter } from "@@/data-table/faceted-filter";
import { Cross2Icon } from "@radix-ui/react-icons";
import BarcodePrintModal from "@views/product/components/barcode-print-modal";

const columns = (
  onPrint: (data: ProductBarCode) => void,
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
        const { byDateId, price } = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onPrint({
                    id: byDateId,
                    price: price,
                  })
                }
              >
                In mã vạch
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
  searchParams: SearchParamsProps;
};

const List = ({ queryString, searchParams }: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  const { data: res, isLoading } = useSWR(
    queryString ? cacheKey + `?${queryString}` : null,
    () => productRequest.getALL(queryString),
  );
  const { data: categoryOptions } = useSWR(
    categoryCacheKey + "/options",
    categoryRequest.getAllOptions,
  );
  const [printData, setPrintData] = useState<ProductBarCode>();
  const [isOpenPrint, setIsOpenPrint] = React.useState(false);

  if (!res && !isLoading) {
    return null;
  }

  const onPageChange = (page: number) => {
    const pageChangeString = queryString
      .split("&")
      .map((query) => (/^page=/.test(query) ? `page=${page}` : query))
      .join("&");
    router.push(`${pathName}?${pageChangeString}`);
  };

  const onSearch = (keyword: string) => {
    let gencParams = generateSearchParams(queryString);
    gencParams.keyword = keyword;
    gencParams.page = "1";
    const keywordChangedString = Object.entries(gencParams)
      .map(([key, value]) => `${key}=${key === "keyword" ? keyword : value}`)
      .join("&");
    router.push(`${pathName}?${keywordChangedString}`);
  };

  const onFilter = (name: string, value: string[]) => {
    const joinedValue = value.join(";");

    let gencParams = generateSearchParams(queryString);
    gencParams[name] = joinedValue;
    gencParams.page = "1";

    const queryChangedString = Object.entries(gencParams)
      .map(([key, value]) => `${key}=${key === name ? joinedValue : value}`)
      .join("&");
    router.push(`${pathName}?${queryChangedString}`);
  };

  const handleReset = () => {
    router.push(`${pathName}`);
  };

  const onPrint = (data: ProductBarCode) => {
    setIsOpenPrint(true);
    setPrintData(data);
  };

  return (
    <>
      <DataTable<ProductType>
        loading={isLoading}
        data={res?.data || []}
        columns={columns(onPrint)}
        pagination={{
          page: res?.page,
          total: res?.totalRecord,
          totalPages: res?.totalPage,
        }}
        onPageChange={onPageChange}
        search={
          <Search
            value={searchParams.keyword}
            placeholder="Nhập mã hoặc tên sản phẩm"
            className="w-52"
            onSearch={onSearch}
          />
        }
        filter={
          <div className="flex gap-2">
            <FacetedFilter
              options={categoryOptions || []}
              selectedValues={
                searchParams.category?.split(";")?.filter(Boolean) || []
              }
              title="Phân loại"
              onFilter={(value) => onFilter("category", value)}
            />
            <FacetedFilter
              options={Object.entries(ProductStatus).map(([key, value]) => ({
                label: key,
                value,
              }))}
              selectedValues={
                searchParams.status?.split(";")?.filter(Boolean) || []
              }
              title="Trạng thái"
              onFilter={(value) => onFilter("status", value)}
            />

            {(searchParams.status ||
              searchParams.keyword ||
              searchParams.category) && (
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
        }
      />
      {isOpenPrint && (
        <BarcodePrintModal
          isOpen={isOpenPrint}
          setIsOpen={setIsOpenPrint}
          product={printData}
          setProduct={setPrintData}
          mode="print"
        />
      )}
    </>
  );
};

export default List;
