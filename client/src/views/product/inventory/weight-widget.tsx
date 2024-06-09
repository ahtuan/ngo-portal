import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@@/ui/card";
import { Button } from "@@/ui/button";
import Link from "next/link";
import { InventoryPath } from "@/constants/path";
import { ArrowUpRight } from "lucide-react";
import InventoryList from "@views/product/inventory/components/inventory-list";
import AddMore from "@views/product/inventory/components/add-more";

const WeightWidget = () => {
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
      <CardFooter className="justify-center border-t py-2 mx-6 mt-auto">
        <AddMore />
      </CardFooter>
    </Card>
  );
};

export default WeightWidget;
