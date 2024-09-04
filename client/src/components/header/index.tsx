import React from "react";
import { ScanBarcode, Search, ShoppingCartIcon, Truck } from "lucide-react";
import { Input } from "@@/ui/input";
import DynamicBreadcrumb from "@@/header/dynamic-breadcrumb";
import Scan from "@views/product/scan";
import { Button } from "@@/ui/button";
import Link from "next/link";
import { OrderPath } from "@/constants/path";
import Logo from "/public/logo.svg";
import Image from "next/image";

function Header() {
  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="hidden sm:flex ">
          <DynamicBreadcrumb />
        </div>
        <Link href="/" className="sm:hidden w-24">
          <Image src={Logo} alt={"logo"} />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link href={OrderPath.Create}>
            <Button variant="ghost" size={"icon"}>
              <ShoppingCartIcon className="text-muted-foreground hover:text-primary" />
            </Button>
          </Link>
          <Link href={OrderPath.Online}>
            <Button variant="ghost" size={"icon"}>
              <Truck className="text-muted-foreground hover:text-primary" />
            </Button>
          </Link>
          <Scan
            trigger={
              <Button variant="ghost" size="icon">
                <ScanBarcode className=" text-muted-foreground hover:text-primary" />
              </Button>
            }
          />
          <div className="relative ml-auto flex-1 md:grow-0 hidden sm:flex">
            <div>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
          </div>
        </div>
      </header>
      <div className="sm:hidden mt-2 pl-4">
        <DynamicBreadcrumb />
      </div>
    </>
  );
}

export default Header;
