"use client";

import React from "react";
import MenuItem from "@@/side-bar/menu-item";
import { checkActiveRoute } from "@/lib/utils";

import { Home, LineChart, Package, ShoppingCart, Users2 } from "lucide-react";
import { PATH } from "@/constants/path";
import { usePathname } from "next/navigation";

const primaryMenu = [
  {
    icon: <ShoppingCart className="h-5 w-5" />,
    text: PATH.dashboard.routes.order.text,
    path: PATH.dashboard.routes.order.path,
    disabled: PATH.dashboard.routes.order.disabled,
  },
  {
    icon: <Package className="h-5 w-5" />,
    text: PATH.dashboard.routes.product.text,
    path: PATH.dashboard.routes.product.path,
    disabled: PATH.dashboard.routes.product.disabled,
  },
  {
    icon: <Home className="h-5 w-5" />,
    text: PATH.dashboard.text,
    path: PATH.dashboard.path,
  },
  {
    icon: <Users2 className="h-5 w-5" />,
    text: PATH.dashboard.routes.customer.text,
    path: PATH.dashboard.routes.customer.path,
    disabled: PATH.dashboard.routes.customer.disabled,
  },
  {
    icon: <LineChart className="h-5 w-5" />,
    text: PATH.dashboard.routes.report.text,
    path: PATH.dashboard.routes.report.path,
    disabled: PATH.dashboard.routes.report.disabled,
  },
];
const Index = () => {
  const pathName = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 flex h-14 items-center gap-4 border-t bg-background px-4 justify-between sm:hidden">
      {primaryMenu.map((item) => (
        <MenuItem
          key={item.path}
          {...item}
          active={checkActiveRoute(item.path, pathName)}
        />
      ))}
    </nav>
  );
};

export default Index;
