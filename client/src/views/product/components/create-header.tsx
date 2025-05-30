"use client";

import React from "react";
import { Button } from "@@/ui/button";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@@/ui/badge";
import Link from "next/link";
import { ProductPath } from "@/constants/path";
import { useRouter } from "next/navigation";
import { CardDescription } from "@@/ui/card";

type CreateHeaderProps = {
  title?: string;
  description?: string;
};

const CreateHeader = ({ title, description }: CreateHeaderProps) => {
  const router = useRouter();
  return (
    <>
      <Link href={`${ProductPath.Base}?page=1`}>
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Trở về</span>
        </Button>
      </Link>
      <div>
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Lô hàng - {title}
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            Đang soạn hàng
          </Badge>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </div>

      <div className="hidden items-center gap-2 md:ml-auto md:flex">
        <Link
          href={`${ProductPath.Base}?page=1`}
          onClick={() => router.prefetch(ProductPath.Base)}
        >
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
