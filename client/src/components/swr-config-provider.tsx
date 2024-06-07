"use client";
import React, { ReactNode } from "react";
import { SWRConfig } from "swr";

const SWRConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SWRConfig
      value={{
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigProvider;
