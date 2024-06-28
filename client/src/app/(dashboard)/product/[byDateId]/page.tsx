import React from "react";
import { productRequest } from "@/api-requests/product.request";
import Upsert from "@views/product/upsert";

type Props = {
  byDateId: string;
};

const Page = async ({ params }: { params: Props }) => {
  const byDateId = params.byDateId;
  const data = await productRequest.getDetail(byDateId);

  return <Upsert detailData={data} mode="edit" />;
};

export default Page;
