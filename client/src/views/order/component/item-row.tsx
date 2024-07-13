import React from "react";
import { TableCell, TableRow } from "@@/ui/table";
import { Button } from "@@/ui/button";
import { Trash } from "lucide-react";
import { FieldArrayWithId } from "react-hook-form";
import { Invoice } from "@/schemas/invoice.schema";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@@/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@@/ui/tooltip";
import Sale from "@views/order/component/sale";

type ItemRowProps = {
  field:
    | FieldArrayWithId<Invoice.DedicatedCreated, "items", "id">
    | Invoice.ItemType;
  onDelete?: () => void;
  onUpdate?: (value: number) => void;
  byKg?: boolean;
  readOnly?: boolean;
};
const ItemRow = ({
  field,
  onDelete,
  onUpdate,
  byKg = false,
  readOnly = false,
}: ItemRowProps) => {
  const [isEditing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState<number>(field.quantity);
  const [total] = React.useState<string>(formatCurrency(field.total, "đ"));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.valueAsNumber);
  };

  const triggerChange = () => {
    setEditing(false);
    onUpdate?.(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      triggerChange();
    }
  };

  const toggleChange = () => {
    if (field.originalStock !== 1 && !readOnly) {
      setEditing(true);
    }
  };

  return (
    <TableRow>
      <TableCell>{field.byDateId}</TableCell>
      <TableCell>
        {field.name} {field.sale && <Sale {...field.sale} />}
      </TableCell>
      <TableCell className="flex items-center leading-9">
        <span>
          {isEditing ? (
            <Input
              className="max-w-20"
              autoFocus
              value={value}
              type="number"
              min={1}
              onChange={handleChange}
              onBlur={triggerChange}
              onKeyDown={onKeyDown}
            />
          ) : (
            <span
              className={field.originalStock !== 1 ? "cursor-pointer" : ""}
              onClick={toggleChange}
            >
              {field.quantity}
            </span>
          )}
        </span>
        {!readOnly && (
          <span className="text-muted-foreground ml-2 text-sm">
            | {field.stock}
          </span>
        )}
      </TableCell>
      <TableCell>{!byKg ? formatCurrency(field.price, "đ") : ""}</TableCell>
      <TableCell
        className={byKg ? "text-muted-foreground" : ""}
        onClick={(e) => e.preventDefault()}
      >
        {byKg ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{total}</TooltipTrigger>
              <TooltipContent>
                <p>{`${field.quantity} * ${field.weight} * ${formatCurrency(field.price)} = ${total}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          total
        )}
      </TableCell>
      {!readOnly && (
        <TableCell>
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

export default ItemRow;
