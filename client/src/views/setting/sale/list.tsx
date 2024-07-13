"use client";

import React from "react";
import { SaleSettingProps } from "@views/setting/sale/index";
import { ColumnDef } from "@tanstack/react-table";
import { ClientSale } from "@/schemas/sale.schema";
import DataTable from "@@/data-table";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import {
  saleEndpoint as cacheKey,
  saleRequest,
} from "@/api-requests/sale.request";
import { formatDate, formatPrice } from "@/lib/utils";
import { Switch } from "@@/ui/switch";
import { Button } from "@@/ui/button";
import { PlusIcon } from "lucide-react";
import CreateModal from "@views/setting/sale/components/create-modal";
import {
  categoryEndpoint as categoryCacheKey,
  categoryRequest,
} from "@/api-requests/category.request";
import { useToast } from "@@/ui/use-toast";

const columns = (
  handleUpdate: (uuid: string, data: ClientSale.Update) => void,
): ColumnDef<ClientSale.Item>[] => {
  return [
    {
      accessorKey: "name",
      header: "Tên",
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      enableHiding: false,
    },
    {
      accessorKey: "startDate",
      header: "Bắt đầu",
      cell: ({ row }) => {
        const { startDate } = row.original;
        return formatDate(startDate.toString());
      },
    },
    {
      accessorKey: "endDate",
      header: "Kết thúc",
      cell: ({ row }) => {
        const { endDate } = row.original;
        return endDate ? formatDate(endDate.toString()) : "-";
      },
    },
    {
      accessorKey: "steps",
      header: "Bước tính",
      enableHiding: false,
    },
    {
      accessorKey: "condition",
      header: "Điều kiện",
      cell: ({ row }) => {
        const { condition } = row.original;

        let formatString = condition.split(" ").reduce((prev, curr) => {
          const currentAsNumber = +curr;
          if (currentAsNumber) {
            prev += " " + formatPrice(currentAsNumber);
          } else {
            prev += " " + curr;
          }
          return prev;
        }, "");
        return formatString;
      },
    },
    {
      accessorKey: "categoriesName",
      header: "Phân loại áp dụng",
      cell: ({ row }) => {
        const { categoriesName, isInvoiceOnly } = row.original;
        return isInvoiceOnly ? "Tổng đơn" : categoriesName || "Món";
      },
    },
    {
      accessorKey: "isActive",
      header: "Sử dụng",
      cell: ({ row }) => {
        const { isActive, uuid } = row.original;
        return (
          <Switch
            checked={isActive}
            onCheckedChange={(checked: boolean) => {
              handleUpdate(uuid, { isActive: checked });
            }}
          />
        );
      },
    },
  ];
};
const List = ({ queryString }: SaleSettingProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const { toast } = useToast();
  const [isCreating, setCreating] = React.useState(false);
  const {
    data: res,
    isLoading,
    mutate,
  } = useSWR(
    queryString ? cacheKey + `?${queryString}` : null,
    saleRequest.getAll,
  );
  const { data: kgCategories } = useSWR(categoryCacheKey + "/options/kg", () =>
    categoryRequest.getAllOptions("kg"),
  );
  const onPageChange = (page: number) => {
    const pageChangeString = queryString
      .split("&")
      .map((query) => (/^page=/.test(query) ? `page=${page}` : query))
      .join("&");
    router.push(`${pathName}?${pageChangeString}`);
  };

  const refresh = async () => {
    await mutate();
    setCreating(false);
  };
  const handleUpdate = async (uuid: string, data: ClientSale.Update) => {
    try {
      await saleRequest.update(uuid, data);
      await refresh();
    } catch (error) {
      console.error(error);
      toast({
        description: "Có lỗi xảy ra khi chỉnh sửa khuyến mãi",
      });
    }
  };
  return (
    <>
      <Button
        size="sm"
        className="absolute top-4 right-4"
        onClick={() => setCreating(!isCreating)}
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        Thêm mới
      </Button>
      <DataTable<ClientSale.Item>
        loading={isLoading}
        data={res?.data || []}
        columns={columns(handleUpdate)}
        pagination={{
          page: res?.page,
          total: res?.totalRecord,
          totalPages: res?.totalPage,
        }}
        onPageChange={onPageChange}
      />
      {isCreating && (
        <CreateModal onClose={refresh} options={kgCategories || []} />
      )}
    </>
  );
};

export default List;
