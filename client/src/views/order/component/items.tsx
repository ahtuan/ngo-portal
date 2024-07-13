"use client";
import React from "react";
import { Card, CardContent } from "@@/ui/card";
import { FieldArrayWithId } from "react-hook-form";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@@/ui/table";
import { Invoice } from "@/schemas/invoice.schema";
import ItemRow from "@views/order/component/item-row";
import CollapseRow from "@views/order/component/collapse-row";

type ItemsProps = {
  fields: (
    | FieldArrayWithId<Invoice.DedicatedCreated, "items", "id">
    | Invoice.ItemType
  )[];
  stackFields: (
    | FieldArrayWithId<Invoice.DedicatedCreated, "stacks", "id">
    | Invoice.StackItemType
  )[];
  onUpdate?: (
    index: number,
    value: number,
    byKg: boolean,
    itemIndex?: number,
  ) => void;
  onDelete?: (index: number, byKg: boolean, itemIndex?: number) => void;
  readOnly?: boolean;
};

const Items = ({
  fields,
  stackFields,
  onUpdate,
  onDelete,
  readOnly = false,
}: ItemsProps) => {
  return (
    <Card className="border-0">
      <CardContent className="h-[calc(100dvh-10rem-15rem)] overflow-y-scroll p-0">
        <Table className="border border-1">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[7.5rem]">Mã</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead className="w-[8rem]">Số lượng</TableHead>
              <TableHead className="w-[6rem]">Đơn giá</TableHead>
              <TableHead className="w-[6rem]">Thành tiền</TableHead>
              {!readOnly && <TableHead className="w-[1rem]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((item, index) => (
              <ItemRow
                field={item}
                key={"id" in item ? item.id : index}
                onUpdate={(value) => onUpdate?.(index, value, false)}
                onDelete={() => onDelete?.(index, false)}
                readOnly={readOnly}
              />
            ))}
            {stackFields.map((stack, index) => (
              <CollapseRow
                field={stack}
                key={"id" in stack ? stack.id : index}
                onUpdate={(value) => onUpdate?.(index, value, true, -2)}
                onDelete={() => onDelete?.(index, true)}
                readOnly={readOnly}
              >
                {stack.items.map((item, itemIndex) => (
                  <ItemRow
                    field={item}
                    key={itemIndex}
                    onUpdate={(value) =>
                      onUpdate?.(index, value, true, itemIndex)
                    }
                    onDelete={() => onDelete?.(index, true, itemIndex)}
                    byKg={true}
                    readOnly={readOnly}
                  />
                ))}
              </CollapseRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Items;
