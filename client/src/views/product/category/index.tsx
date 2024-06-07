import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryList from "@views/product/category/category-list";

const Component = () => {
  return (
    <Card className="min-h-64 flex flex-col">
      <CardHeader>
        <CardTitle>Phân loại sản phẩm</CardTitle>
      </CardHeader>
      <CategoryList />
    </Card>
  );
};
export default Component;
