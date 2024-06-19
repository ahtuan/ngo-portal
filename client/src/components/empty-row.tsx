import React from "react";
import { TableCell, TableRow } from "@@/ui/table";
import { CakeSlice } from "lucide-react";

type Props = {
  colSpan?: number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
};
const EmptyRow = ({
  colSpan = 3,
  icon = <CakeSlice className="w-10 h-10 text-muted-foreground" />,
  description = "Không có dữ liệu",
  className,
}: Props) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-4">
        <div className="flex flex-col items-center gap-4">
          {icon}
          <p className="text-muted-foreground">{description}</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyRow;
