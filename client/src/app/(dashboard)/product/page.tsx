import React from "react";
import Product from "@views/product";
import { getQueryString } from "@/lib/utils";
import { redirect } from "next/navigation";
import { ProductPath } from "@/constants/path";

export type SearchParamsProps = {
  page: string;
  size: string;
  category: string;
  keyword: string;
  status: string;
};

const Page = ({ searchParams }: { searchParams: SearchParamsProps }) => {
  if (!searchParams.page) {
    return redirect(`${ProductPath.Base}?${getQueryString(searchParams)}`);
  }
  const queryString = getQueryString(searchParams);
  return (
    <Product
      key={queryString}
      searchParams={searchParams}
      queryString={queryString}
    />
  );
};

export default Page;
export const dynamic = "force-dynamic";
