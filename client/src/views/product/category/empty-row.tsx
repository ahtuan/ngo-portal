import React from "react";
import { TableCell, TableRow } from "@@/ui/table";
import { CakeSlice } from "lucide-react";

const EmptyRow = () => {
  return (
    <TableRow>
      <TableCell colSpan={3} className="text-center py-4">
        <div className="flex flex-col items-center gap-4">
          <CakeSlice className="w-10 h-10 text-muted-foreground" />
          <p className="text-muted-foreground">Không có loại sản phẩm</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyRow;
