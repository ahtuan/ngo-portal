import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@@/ui/card";
import { Grid2X2Icon, Tags } from "lucide-react";
import Link from "next/link";
import { SettingPath } from "@/constants/path";

type ItemProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  href: string;
};
const Item = ({ icon, title, description, href }: ItemProps) => {
  return (
    <Link href={href}>
      <div className="flex items-center gap-4 p-4 pl-0">
        <div className="flex min-h-10 min-w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </Link>
  );
};

const List: ItemProps[] = [
  {
    icon: <Grid2X2Icon />,
    title: "Phân loại",
    description: "Tuỳ chọn loại sản phẩm theo số lượng hoặc kg",
    href: SettingPath.Category,
  },
  {
    icon: <Tags />,
    title: "Khuyến mãi",
    description: "Tuỳ chọn các chương trình giảm giá",
    href: SettingPath.Sale,
  },
];

const Setting = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {List.map((item, index) => (
          <Item {...item} key={index} />
        ))}
      </CardContent>
    </Card>
  );
};

export default Setting;
