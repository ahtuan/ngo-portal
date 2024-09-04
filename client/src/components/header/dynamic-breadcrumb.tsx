"use client";

import { Breadcrumb } from "@@/ui/breadcrumb";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getBreadcrumb } from "@/lib/utils";
import DynamicBreadcrumbList from "@@/header/dynamic-breadcrumb-list";

const DynamicBreadcrumb = () => {
  const pathName = usePathname();
  const [breadcrumb, setBreadcrumb] = useState<Common.Breadcrumb[]>([]);
  useEffect(() => {
    const paths = getBreadcrumb(pathName);
    setBreadcrumb(paths);
  }, [pathName]);

  return (
    <Breadcrumb>
      <DynamicBreadcrumbList items={breadcrumb} />
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
