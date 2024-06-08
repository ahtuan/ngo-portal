import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@@/ui/card";
import { Button } from "@@/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import InventoryList from "@views/product/inventory/inventory-list";
import { InventoryPath } from "@/constants/path";
import AddMore from "@views/product/inventory/add-more";

const Index = () => {
  return (
    <Card className="min-h-[45dvh] flex flex-col">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Lô hàng</CardTitle>
          <CardDescription>Thống kê trọng lượng sản phẩm</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href={InventoryPath.Base}>
            Tất cả
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <InventoryList />
      <AddMore />
    </Card>
  );
};

export default Index;
