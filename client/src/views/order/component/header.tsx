import React, { useCallback } from "react";
import Link from "next/link";
import { OrderPath } from "@/constants/path";
import { Button } from "@@/ui/button";
import { ChevronLeft } from "lucide-react";

type HeaderProps = {
  isOnline?: boolean;
};
const Header = ({ isOnline }: HeaderProps) => {
  const getBackLink = useCallback(() => {
    return `${OrderPath.Base}?page=1`;
  }, []);
  return (
    <div className="flex space-x-2 w-full">
      <Link href={getBackLink()}>
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Trở về</span>
        </Button>
      </Link>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        {isOnline ? "Tạo đơn trực tuyến" : `Tạo đơn hàng`}
      </h1>

      <div className="items-center  ml-auto space-x-2">
        <Link href={getBackLink()}>
          <Button variant="outline" size="sm">
            Huỷ
          </Button>
        </Link>

        <Button size="sm">Hoàn tất</Button>
      </div>
    </div>
  );
};

export default Header;
