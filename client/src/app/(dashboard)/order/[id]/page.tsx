import React from "react";
import {
  invoiceEndpoint,
  invoiceRequest,
} from "@/api-requests/invoice.request";
import Upsert from "@views/order/upsert";

type Props = {
  id: string;
};

const Page = async ({ params }: { params: Props }) => {
  const id = params.id;
  const data = await invoiceRequest.getDetail(`${invoiceEndpoint}/${id}`);
  return <Upsert data={data} byDateId={id} isOnline={data?.isOnline} />;
};

export default Page;
