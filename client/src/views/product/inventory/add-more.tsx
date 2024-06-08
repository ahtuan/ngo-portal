import React from "react";
import { CardFooter } from "@@/ui/card";
import { Button } from "@@/ui/button";
import { PlusCircle } from "lucide-react";
import UpsertModal from "@views/product/inventory/upsert-modal";

const AddMore = () => {
  return (
    <CardFooter className="justify-center border-t py-2 mx-6 mt-auto">
      <UpsertModal
        trigger={
          <Button size="sm" variant="ghost" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            Thêm mới
          </Button>
        }
      />
    </CardFooter>
  );
};

export default AddMore;
