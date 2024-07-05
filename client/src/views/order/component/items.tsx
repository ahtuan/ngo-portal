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
import { InvoiceCreate } from "@/schemas/invoice.schema";
import ItemRow from "@views/order/component/item-row";
import CollapseRow from "@views/order/component/collapse-row";

type ItemsProps = {
  fields: FieldArrayWithId<InvoiceCreate, "items", "id">[];
  stackFields: FieldArrayWithId<InvoiceCreate, "stacks", "id">[];
  onUpdate?: (
    index: number,
    value: number,
    byKg: boolean,
    itemIndex?: number,
  ) => void;
  onDelete?: (index: number, byKg: boolean, itemIndex?: number) => void;
};

const Items = ({ fields, stackFields, onUpdate, onDelete }: ItemsProps) => {
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
              <TableHead className="w-[1rem]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((item, index) => (
              <ItemRow
                field={item}
                key={item.id}
                onUpdate={(value) => onUpdate?.(index, value, false)}
                onDelete={() => onDelete?.(index, false)}
              />
            ))}
            {stackFields.map((stack, index) => (
              <CollapseRow
                field={stack}
                key={stack.id}
                onUpdate={(value) => onUpdate?.(index, value, true, -2)}
                onDelete={() => onDelete?.(index, true)}
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
