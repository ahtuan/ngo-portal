"use client";

import React from "react";
import { Table, TableHead, TableHeader, TableRow } from "@@/ui/table";
import { CardContent } from "@@/ui/card";

const InventoryList = () => {
  return (
    <>
      <CardContent className="pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Lô</TableHead>
              <TableHead>Cân nặng</TableHead>
              <TableHead>Còn lại</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </CardContent>
    </>
  );
};

export default InventoryList;
