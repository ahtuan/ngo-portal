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
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Danh sách đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[calc(100dvh-8rem)]">
        <Suspense>
          <List queryString={queryString} searchParams={searchParams} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Order;
