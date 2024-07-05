import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import List from "@views/order/list";

type Props = {
  queryString: string;
};

const Order = ({ queryString }: Props) => {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Danh sách đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-[calc(100dvh-8rem)]">
            <Suspense>
              <List queryString={queryString} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4"></div>
    </div>
  );
};

export default Order;
