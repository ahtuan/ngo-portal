import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import AddMore from "@views/inventory/components/add-more";
import InventoryTable from "@views/inventory/components/inventory-table";

const Index = () => {
  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <AddMore variant="default" />
      </div>
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Danh sách lô hàng</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-[79dvh]">
          <InventoryTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
