"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  productEndpoint as cacheKey,
  productRequest,
} from "@/api-requests/product.request";
import { ProductBarCode, ProductType } from "@/schemas/product.schema";
import { ColumnDef } from "@tanstack/react-table";
import {
  formatCurrency,
  formatPrice,
  generateSearchParams,
  getFastId,
} from "@/lib/utils";
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
import { usePathname, useRouter } from "next/navigation";
import Search from "@@/data-table/search";
import { SearchParamsProps } from "@/app/(dashboard)/product/page";
import {
  categoryEndpoint as categoryCacheKey,
  categoryRequest,
} from "@/api-requests/category.request";
import { FacetedFilter } from "@@/data-table/faceted-filter";
import { Cross2Icon } from "@radix-ui/react-icons";
import BarcodePrintModal from "@views/product/components/barcode-print-modal";
import Link from "next/link";
import { ProductPath } from "@/constants/path";
import DisplayImage from "@@/display-image";

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
        return (
          <DisplayImage
            src={mainImage}
            hoverContent={
              <div className="flex justify-between mt-2">
                <p>{byDateId}</p>
                <p>{formatPrice(price)}</p>
              </div>
            }
          />
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
        const statusObj = Object.values(ProductStatus).find(
          ({ value }) => value === status,
        );
        let statusVal = status;
        if (statusObj) {
          statusVal = statusObj.label;
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
        const byGram = weight * 1000;
        return byGram < 1000 ? byGram + "g" : formatCurrency(weight) + " kg";
      },
    },
    {
      accessorKey: "quantity",
      header: "Số lượng",
      cell: ({ row }) => {
        const { quantity, soldOut } = row.original;
        const stock = quantity - soldOut;
        return (
          <span>
            {stock}
            <span className="ml-1 text-muted-foreground">{`| ${quantity}`}</span>{" "}
          </span>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => {
        const { unit } = row.original;
        return (
          formatCurrency(row.getValue("price")) +
          " đ" +
          (unit === "KG" ? "/kg" : "")
        );
      },
    },
    {
      accessorKey: "categoryName",
      header: "Phân loại",
      cell: ({ row }) => {
        const { categoryName, categoryNameByKg, isUsedCategoryPrice } =
          row.original;
        return (
          <span>
            {categoryName ?? "Khác"}
            {categoryNameByKg
              ? `/ ${categoryNameByKg}`
              : isUsedCategoryPrice && " - Đồng giá"}
          </span>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { byDateId, price, quantity, status, categoryUuidByKg } =
          row.original;
        return (
          <>
            {status !== ProductStatus.SOLD.value && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`${ProductPath.Update(byDateId)}`}>
                    <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={() =>
                      onPrint({
                        id: byDateId,
                        price: price,
                        quantity,
                        isUsedCategoryPrice: !categoryUuidByKg,
                      })
                    }
                  >
                    In mã vạch
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
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

  const {
    data: res,
    error,
    isLoading,
    mutate,
  } = useSWR(queryString ? cacheKey + `?${queryString}` : null, () =>
    productRequest.getALL(queryString),
  );

  useEffect(() => {
    if (!isLoading && !error) {
      mutate();
    }
  }, [isLoading, mutate, error]);

  const { data: categoryOptions } = useSWR(
    categoryCacheKey + "/options/all",
    () => categoryRequest.getAllOptions("all"),
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
    gencParams.keyword = getFastId(keyword);
    gencParams.page = "1";
    const keywordChangedString = Object.entries(gencParams)
      .map(([key, value]) => `${key}=${value}`)
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
        columnVisibility={{
          weight: false,
          categoryName: false,
        }}
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
              options={Object.values(ProductStatus)}
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
      {isOpenPrint && printData && (
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
