import React from "react";
import { Scan as ScanIcon, Search } from "lucide-react";
import { Input } from "@@/ui/input";
import DynamicBreadcrumb from "@@/header/dynamic-breadcrumb";
import Scan from "@views/product/scan";

function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <DynamicBreadcrumb />
      <div className="ml-auto flex items-center gap-2">
        <Scan
          trigger={
            <ScanIcon className="cursor-pointer text-muted-foreground hover:text-primary" />
          }
        />
        <div className="relative ml-auto flex-1 md:grow-0">
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
  );
}

export default Header;
