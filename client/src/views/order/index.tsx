import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import List from "@views/order/list";
import { SearchParamsProps } from "@/app/(dashboard)/order/page";

type Props = {
  queryString: string;
  searchParams: SearchParamsProps;
};

const Order = ({ queryString, searchParams }: Props) => {
  return (
    <Card className="max-w-[calc(100dvw-2rem)] ">
      <CardHeader className="pb-0 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle>Danh sách đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[calc(100dvh-13rem)] sm:min-h-[calc(100dvh-8rem)] px-4 sm:px-6">
        <Suspense>
          <List queryString={queryString} searchParams={searchParams} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Order;
