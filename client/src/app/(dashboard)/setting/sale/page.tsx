import React from "react";
import { redirect } from "next/navigation";
import { SettingPath } from "@/constants/path";
import { getQueryString } from "@/lib/utils";
import Sale from "@views/setting/sale";

export type SaleParamsProps = {
  page: string;
  size: string;
};

const Page = ({ searchParams }: { searchParams: SaleParamsProps }) => {
  if (!searchParams.page) {
    return redirect(`${SettingPath.Sale}?${getQueryString(searchParams)}`);
  }
  const queryString = getQueryString(searchParams);
  return (
    <Sale
      key={queryString}
      searchParams={searchParams}
      queryString={queryString}
    />
  );
};
export default Page;
