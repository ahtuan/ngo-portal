"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import Pagination from "@@/data-table/pagination";
import Header from "@@/data-table/header";
import Body from "@@/data-table/body";
import Loading from "@@/loading";
import { cn } from "@/lib/utils";

export type Paging = {
  total?: number;
  totalPages?: number;
  page?: number;
};

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: Paging;
  onPageChange?: (page: number) => void;
  search?: React.ReactNode;
  filter?: React.ReactNode;
  loading?: boolean;
  minHeightClass?: string;
  columnVisibility?: VisibilityState;
  allowManualHide?: boolean;
};

const DataTable = <T extends {}>({
  data,
  columns,
  pagination,
  onPageChange,
  search,
  filter,
  loading,
  minHeightClass = "min-h-[calc(100%-13rem)] sm:min-h-[calc(100%-7rem)]",
  columnVisibility: columnVisibilityDefault = {},
  allowManualHide = true,
}: Props<T>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(columnVisibilityDefault);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
  });

  return (
    <div className="w-full max-w-[100dvw]">
      <Header<T>
        table={table}
        search={search}
        filter={filter}
        allowManualHide={allowManualHide}
      />
      <div className={cn("rounded-md border  flex flex-col", minHeightClass)}>
        {loading ? (
          <Loading className="my-auto" size="large" />
        ) : (
          <Body table={table} totalColSpan={columns.length} />
        )}
      </div>
      {pagination && (
        <Pagination<T>
          table={table}
          pagination={pagination}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
export default DataTable;
