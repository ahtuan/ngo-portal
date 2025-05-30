"use client";
import React from "react";
import EditableRow from "@views/setting/category/components/editable-row";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@@/ui/table";
import { CategoryType } from "@/schemas/category.schema";
import { CardContent } from "@@/ui/card";
import AddMore from "@views/setting/category/components/add-more";
import useSWR, { mutate as globalMutate } from "swr";
import {
  categoryEndpoint as cacheKey,
  categoryMutateOptions,
  categoryRequest,
} from "@/api-requests/category.request";
import Loading from "@@/loading";
import EmptyRow from "@@/empty-row";

type Props = {
  queryString: string;
};
const CategoryList = ({ queryString }: Props) => {
  const { data, isLoading, mutate } = useSWR(cacheKey, categoryRequest.getAll);
  const [addedData, setAddedData] = React.useState<CategoryType | null>(null);

  if (isLoading) {
    return <Loading className="h-full" />;
  }

  const handleAddMore = () => {
    setAddedData({
      uuid: "",
      name: "",
      price: 0,
    });
  };
  const handleCancelAddMore = () => {
    setAddedData(null);
  };

  const upsertMutate = async (upsert: CategoryType, isCreate: boolean) => {
    let categories = data ?? [];
    if (isCreate) {
      categories = [upsert, ...categories];
    } else {
      categories = categories.map((item) => {
        if (item.uuid === upsert.uuid) {
          return upsert;
        }
        return item;
      });
    }
    await mutate(categories, categoryMutateOptions(categories));
    await globalMutate(queryString);
  };

  const deleteMutate = async (id: string) => {
    const categories = data?.filter((item) => item.uuid !== id) ?? [];
    await mutate(categories, categoryMutateOptions(categories));
  };
  return (
    <>
      <CardContent className="pb-2">
        <AddMore handleAddMore={handleAddMore} disabled={!!addedData} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 w-[130px]">Tên</TableHead>
              <TableHead className="pl-4">Giá</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length
              ? data.map((item) => (
                  <EditableRow
                    key={item.uuid}
                    {...item}
                    handleCancelAddMore={handleCancelAddMore}
                    upsertMutate={upsertMutate}
                    deleteMutate={deleteMutate}
                  />
                ))
              : !addedData && <EmptyRow />}
            {addedData && (
              <EditableRow
                {...addedData}
                defaultMode={true}
                handleCancelAddMore={handleCancelAddMore}
                upsertMutate={upsertMutate}
                deleteMutate={deleteMutate}
              />
            )}
          </TableBody>
        </Table>
      </CardContent>
    </>
  );
};

export default CategoryList;
