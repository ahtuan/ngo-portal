import React, { Suspense } from "react";
import Category from "@views/category";
import WeightWidget from "@views/inventory/weight-widget";
import DetectInventory from "@views/product/components/detect-inventory";
import List from "@views/product/list";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";

const Index = () => {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Danh sách sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-[79dvh]">
            <Suspense>
              <List />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4">
        <Category />
        <WeightWidget />
        <DetectInventory />
      </div>
    </div>
  );
};

export default Index;
