import React, { Suspense } from "react";
import List from "@views/product/list";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import { SearchParamsProps } from "@/app/(dashboard)/product/page";
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
    <>
      <Card className="max-w-[calc(100dvw-2rem)] ">
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
      {/*<DetectInventory />*/}
    </>
  );
};

export default Index;
