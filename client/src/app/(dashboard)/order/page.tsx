export const dynamic = "force-dynamic";
import React from "react";
import Order from "@views/order";
import { redirect } from "next/navigation";
import { OrderPath } from "@/constants/path";
import { getQueryString } from "@/lib/utils";
import dayjs from "dayjs";

export type SearchParamsProps = {
  page: string;
  size: string;
  keyword: string;
  isOnline: string;
  status: string;
  from: string;
  to: string;
  timestamp?: string;
};

const Page = ({ searchParams }: { searchParams: SearchParamsProps }) => {
  if (!searchParams.page || !searchParams.from) {
    searchParams.from = dayjs().utc(true).startOf("month").format("YYYY-MM-DD");
    searchParams.to = dayjs().utc(true).endOf("date").format("YYYY-MM-DD");
    searchParams.timestamp = dayjs().unix().toString();
    return redirect(`${OrderPath.Base}?${getQueryString(searchParams)}`);
  }

  const queryString = getQueryString(searchParams);
  return <Order queryString={queryString} searchParams={searchParams} />;
};

export default Page;
