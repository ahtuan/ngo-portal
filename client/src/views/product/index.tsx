import React, { Suspense } from "react";
import Category from "@views/category";
import DetectInventory from "@views/product/components/detect-inventory";
import List from "@views/product/list";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import { SearchParamsProps } from "@/app/(dashboard)/product/page";
import { productEndpoint as cacheKey } from "@/api-requests/product.request";
import Link from "next/link";
import { Button } from "@@/ui/button";
import { PlusIcon } from "lucide-react";
import { InventoryPath } from "@/constants/path";

type Props = {
  queryString: string;
  searchParams: SearchParamsProps;
};

const Index = ({ queryString, searchParams }: Props) => {
  return (
    <div className="grid flex-1 items-start gap-4 lg:gap-6 lg:grid-cols-3">
      <div className="grid auto-rows-max items-start lg:col-span-2">
        <Card>
          <CardHeader className="pt-3 pb-0 flex justify-between flex-row items-center">
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <Link href={`${InventoryPath.Base}`}>
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-1" />
                Thêm mới
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex min-h-[calc(100dvh-8rem)]">
            <Suspense>
              <List queryString={queryString} searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4">
        <Category queryString={`${cacheKey}?${queryString}`} />
        {/*<WeightWidget />*/}
        <DetectInventory />
      </div>
    </div>
  );
};

export default Index;
