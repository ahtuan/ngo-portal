import React from "react";
import { SearchParamsProps } from "@/app/(dashboard)/setting/category/page";
import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import CategoryList from "@views/setting/category/category-list";

export type CategorySettingProps = {
  queryString: string;
  searchParams: SearchParamsProps;
};

const Index = ({ queryString, searchParams }: CategorySettingProps) => {
  return (
    <Card className="relative">
      <CardHeader className="pt-3 pb-0 flex justify-between flex-row items-center ">
        <CardTitle>Danh sách phân loại</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[calc(100dvh-8rem)] pt-4">
        <CategoryList queryString={queryString} />
      </CardContent>
    </Card>
  );
};

export default Index;
