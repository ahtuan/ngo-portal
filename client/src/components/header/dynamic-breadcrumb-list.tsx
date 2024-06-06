import React from "react";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@@/ui/breadcrumb";
import Link from "next/link";

const DynamicBreadcrumbList = ({ items }: { items: Common.Breadcrumb[] }) => {
  return (
    <BreadcrumbList>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              {item.path ? (
                <Link href={item.path}>{item.text}</Link>
              ) : (
                <BreadcrumbPage>{item.text}</BreadcrumbPage>
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {index < items.length - 1 && <BreadcrumbSeparator />}
        </React.Fragment>
      ))}
    </BreadcrumbList>
  );
};

export default DynamicBreadcrumbList;
