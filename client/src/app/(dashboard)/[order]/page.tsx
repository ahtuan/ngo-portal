import React from "react";
import Order from "@views/order";
import { redirect } from "next/navigation";
import { OrderPath } from "@/constants/path";
import { getQueryString } from "@/lib/utils";

export type SearchParamsProps = {
  page: string;
  size: string;
  keyword: string;
};

const Page = ({ searchParams }: { searchParams: SearchParamsProps }) => {
  if (!searchParams.page) {
    return redirect(`${OrderPath.Base}?${getQueryString(searchParams)}`);
  }
  const queryString = getQueryString(searchParams);
  return <Order queryString={queryString} />;
};

export default Page;
