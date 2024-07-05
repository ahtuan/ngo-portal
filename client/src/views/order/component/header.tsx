import React, { useCallback } from "react";
import Link from "next/link";
import { OrderPath } from "@/constants/path";
import { Button } from "@@/ui/button";
import { ChevronLeft } from "lucide-react";

const Header = () => {
  const getBackLink = useCallback(() => {
    return `${OrderPath.Base}?page=1`;
  }, []);
  return (
    <>
      <Link href={getBackLink()}>
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Trở về</span>
        </Button>
      </Link>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        Tạo đơn hàng
      </h1>

      <div className="hidden items-center gap-2 md:ml-auto md:flex">
        <Link href={getBackLink()}>
          <Button variant="outline" size="sm">
            Huỷ
          </Button>
        </Link>

        <Button size="sm">Hoàn tất</Button>
      </div>
    </>
  );
};

export default Header;
