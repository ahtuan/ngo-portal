import React from "react";
import { Button } from "@@/ui/button";
import {
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon } from "lucide-react";
import { Table } from "@tanstack/table-core";
import { Paging } from "@@/data-table/index";

type Props<T> = {
  pagination: Paging;
  table: Table<T>;
  onPageChange?: (page: number) => void;
};

const Pagination = <T extends {}>({
  table,
  pagination,
  onPageChange,
}: Props<T>) => {
  const { total, totalPages, page } = pagination;

  return (
    <div className="flex items-center justify-end space-x-2 pt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Hiển thị {table.getRowCount()} của tất cả {total} dòng.
      </div>
      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        Trang {page} của {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => onPageChange?.(1)}
          disabled={page < 2}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange?.(page - 1)}
          disabled={page === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange?.(page + 1)}
          disabled={page === totalPages}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => onPageChange?.(totalPages)}
          disabled={page === totalPages}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
