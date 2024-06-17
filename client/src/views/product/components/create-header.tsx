import React from "react";
import { Button } from "@@/ui/button";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@@/ui/badge";
import Link from "next/link";
import { ProductPath } from "@/constants/path";

type CreateHeaderProps = {
  title: string;
};

const CreateHeader = ({ title }: CreateHeaderProps) => {
  return (
    <>
      <Link href={ProductPath.Base}>
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Trở về</span>
        </Button>
      </Link>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        Lô hàng - {title}
      </h1>
      <Badge variant="outline" className="ml-auto sm:ml-0">
        Đang soạn hàng
      </Badge>
      <div className="hidden items-center gap-2 md:ml-auto md:flex">
        <Link href={ProductPath.Base}>
          <Button variant="outline" size="sm">
            Huỷ
          </Button>
        </Link>
        
        <Button size="sm">Lưu</Button>
      </div>
    </>
  );
};

export default CreateHeader;
