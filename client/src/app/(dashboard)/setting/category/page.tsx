import React from "react";
import { redirect } from "next/navigation";
import { SettingPath } from "@/constants/path";
import { getQueryString } from "@/lib/utils";
import Category from "@views/setting/category";

export type SearchParamsProps = {
  page: string;
  size: string;
};

const Page = ({ searchParams }: { searchParams: SearchParamsProps }) => {
  if (!searchParams.page) {
    return redirect(`${SettingPath.Category}?${getQueryString(searchParams)}`);
  }
  const queryString = getQueryString(searchParams);
  return (
    <Category
      key={queryString}
      searchParams={searchParams}
      queryString={queryString}
    />
  );
};

export default Page;
