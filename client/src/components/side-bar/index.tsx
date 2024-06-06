"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  LineChart,
  Package,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";
import Avatar from "@@/side-bar/avatar";
import MenuItem from "@@/side-bar/menu-item";
import { usePathname } from "next/navigation";
import { checkActiveRoute } from "@/lib/utils";
import Image from "next/image";
import Logo from "/public/logo.svg";
import { PATH } from "@/constants/path";

const primaryMenu = [
  {
    icon: <Home className="h-5 w-5" />,
    text: PATH.dashboard.text,
    path: PATH.dashboard.path,
  },
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

const secondaryMenu = [
  {
    icon: <Settings className="h-5 w-5" />,
    text: PATH.setting.text,
    path: PATH.setting.path,
    disabled: PATH.setting.disabled,
  },
];

const Index = () => {
  const pathName = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <Link href="/">
          <Image src={Logo} alt={"logo"} />
        </Link>
        {primaryMenu.map((item) => (
          <MenuItem
            key={item.path}
            {...item}
            active={checkActiveRoute(item.path, pathName)}
          />
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
        {secondaryMenu.map((item) => (
          <MenuItem key={item.path} {...item} />
        ))}
        <Avatar />
      </nav>
    </aside>
  );
};

export default Index;
