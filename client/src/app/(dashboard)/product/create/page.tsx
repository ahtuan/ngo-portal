import React, { Suspense } from "react";
import Upsert from "@views/product/upsert";

const Page = () => {
  return (
    <Suspense>
      <Upsert />
    </Suspense>
  );
};

export default Page;
