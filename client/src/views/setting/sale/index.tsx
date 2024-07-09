import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import React from "react";
import { SaleParamsProps } from "@/app/(dashboard)/setting/page";

export type SaleSettingProps = {
  queryString: string;
  searchParams: SaleParamsProps;
};

const Index = ({ queryString, searchParams }: SaleSettingProps) => {
  return (
    <Card className="relative">
      <CardHeader className="pt-3 pb-0 flex justify-between flex-row items-center ">
        <CardTitle>Chương trình khuyến mãi</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[calc(100dvh-8rem)] pt-4"></CardContent>
    </Card>
  );
};
export default Index;
