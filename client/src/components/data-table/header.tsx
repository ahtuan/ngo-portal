import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { Button } from "@@/ui/button";
import { ChevronDown } from "lucide-react";
import { Table } from "@tanstack/table-core";

type Props<T> = {
  table: Table<T>;
  search?: React.ReactNode;
  filter?: React.ReactNode;
  allowManualHide?: boolean;
};

const Header = <T extends {}>({
  table,
  search,
  filter,
  allowManualHide,
}: Props<T>) => {
  return (
    <div className="flex justify-between py-4">
      <div className="flex gap-2">
        {search}
        {filter}
      </div>
      {allowManualHide && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Điều chỉnh cột <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const header = column.columnDef.header as string;
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {header}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default Header;
