import { Card, CardHeader, CardTitle } from "@@/ui/card";
import CategoryList from "@views/category/category-list";

type Props = {
  queryString: string;
};
const Category = ({ queryString }: Props) => {
  return (
    <Card className="min-h-[42dvh] flex flex-col">
      <CardHeader>
        <CardTitle>Phân loại sản phẩm</CardTitle>
      </CardHeader>
      <CategoryList queryString={queryString} />
    </Card>
  );
};
export default Category;
