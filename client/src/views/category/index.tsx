import { Card, CardHeader, CardTitle } from "@@/ui/card";
import CategoryList from "@views/category/category-list";

const Component = () => {
  return (
    <Card className="min-h-[42dvh] flex flex-col">
      <CardHeader>
        <CardTitle>Phân loại sản phẩm</CardTitle>
      </CardHeader>
      <CategoryList />
    </Card>
  );
};
export default Component;
