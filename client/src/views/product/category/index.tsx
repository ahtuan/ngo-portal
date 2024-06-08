import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryList from "@views/product/category/category-list";

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
