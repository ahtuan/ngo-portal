import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryList from "@views/product/category/category-list";
import { categoryRequest } from "@/api-requests/category.request";

const Component = async () => {
  const res = await categoryRequest.getAll();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân loại sản phẩm</CardTitle>
      </CardHeader>
      <CategoryList data={res.data || []} />
    </Card>
  );
};
export default Component;
