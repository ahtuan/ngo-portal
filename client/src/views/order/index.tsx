import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import List from "@views/order/list";

type Props = {
  queryString: string;
};

const Order = ({ queryString }: Props) => {
  return (
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
  );
};

export default Order;
