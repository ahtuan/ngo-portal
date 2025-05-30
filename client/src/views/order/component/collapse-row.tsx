"use client";
import React from "react";
import { TableCell, TableRow } from "@@/ui/table";
import { Input } from "@@/ui/input";
import { fixed, formatCurrency } from "@/lib/utils";
import { Button } from "@@/ui/button";
import { SquareArrowDown, SquareArrowUp, Trash } from "lucide-react";
import { FieldArrayWithId } from "react-hook-form";
import { Invoice } from "@/schemas/invoice.schema";
import Sale from "@views/order/component/sale";

type Props = {
  field:
    | FieldArrayWithId<Invoice.DedicatedCreated, "stacks", "id">
    | Invoice.StackItemType;
  children: React.ReactNode;
  onDelete?: () => void;
  onUpdate?: (value: number) => void;
  readOnly?: boolean;
};
const CollapseRow = ({
  field,
  children,
  onDelete,
  onUpdate,
  readOnly = false,
}: Props) => {
  const [show, setShow] = React.useState(true);
  const [isEditing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState<number>(field.weight);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onUpdate?.(value);
    }
  };

  const triggerChange = () => {
    setEditing(false);
    onUpdate?.(value);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    setValue(value ? value : 0);
  };
  return (
    <>
      <TableRow>
        <TableCell>
          <Button
            variant="ghost"
            size="icon"
            onClick={(event) => {
              setShow(!show);
              event.preventDefault();
            }}
          >
            {show ? (
              <SquareArrowUp className="h-4 w-4" />
            ) : (
              <SquareArrowDown className="h-4 w-4" />
            )}
          </Button>
        </TableCell>

        <TableCell colSpan={2}>
          <div className="flex items-center">
            {field.name} {field.sale && <Sale {...field.sale} />}
          </div>
        </TableCell>
        <TableCell className="flex items-center leading-9">
          <span>
            {isEditing ? (
              <Input
                className="max-w-20"
                autoFocus
                type="number"
                value={value}
                min={0}
                onBlur={triggerChange}
                onChange={handleOnChange}
                onKeyDown={onKeyDown}
              />
            ) : (
              <span onClick={() => !readOnly && setEditing(true)}>
                {fixed(field.weight, 3) + " kg"}
              </span>
            )}
          </span>
        </TableCell>
        <TableCell>{formatCurrency(field.price, "đ")}</TableCell>
        <TableCell>
          <p
            className={
              field.sale?.isApplied ? "text-muted-foreground line-through" : ""
            }
          >
            {formatCurrency(field.total, "đ")}
          </p>
          <p className={field.sale?.isApplied ? "visible" : "hidden"}>
            {formatCurrency(field.afterSale, "đ")}
          </p>
        </TableCell>
        {!readOnly && (
          <TableCell>
            <Button size="icon" variant="ghost" onClick={onDelete}>
              <Trash className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
          </TableCell>
        )}
      </TableRow>
      {show ? children : null}
    </>
  );
};

export default CollapseRow;
