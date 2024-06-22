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

export type Paging = {
  total: number;
  totalPages: number;
  page: number;
};

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: Paging;
  onPageChange?: (page: number) => void;
  search?: React.ReactNode;
  filter?: React.ReactNode;
};

const Index = <T extends {}>({
  data,
  columns,
  pagination,
  onPageChange,
  search,
  filter,
}: Props<T>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
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
    <div className="w-full">
      <Header<T> table={table} search={search} filter={filter} />
      <div className="rounded-md border min-h-[530px]">
        <Body table={table} totalColSpan={columns.length} />
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
export default Index;
