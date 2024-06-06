"use client";
import React from "react";
import CategoryEditableRow from "@views/product/category/category-editable-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@@/ui/table";
import { CakeSlice } from "lucide-react";
import { CategoryType } from "@/schemas/category.schema";
import { CardContent } from "@@/ui/card";
import AddMore from "@views/product/category/add-more";
import { useRouter } from "next/navigation";

type Props = {
  data: CategoryType[]; // category list type
};

const CategoryList = ({ data }: Props) => {
  const [renderData, setRenderData] = React.useState<CategoryType[]>(data);
  const router = useRouter();
  const refresh = () => {
    router.push("/product");
    router.refresh();
  };
  const handleAddMore = () => {
    setRenderData((pre) => [
      ...pre,
      {
        uuid: "",
        name: "",
        price: 0,
        defaultMode: true,
      },
    ]);
  };
  const handleCancelAddMore = () => {
    setRenderData((pre) => pre.filter((item) => item.uuid));
  };

  return (
    <>
      <CardContent className="pb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead className="pl-4">Giá</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderData.length > 0 ? (
              renderData.map((item) => (
                <CategoryEditableRow
                  key={item.uuid}
                  {...item}
                  handleCancelAddMore={handleCancelAddMore}
                  refresh={refresh}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  <div className="flex flex-col items-center gap-4">
                    <CakeSlice className="w-10 h-10 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Không có loại sản phẩm
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <AddMore
        handleAddMore={handleAddMore}
        disabled={renderData.some((item) => !item.uuid)}
      />
    </>
  );
};

export default CategoryList;
