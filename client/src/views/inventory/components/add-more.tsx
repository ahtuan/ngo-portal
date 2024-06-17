import React from "react";
import { Button } from "@@/ui/button";
import { PlusCircle } from "lucide-react";
import UpsertModal from "@views/inventory/components/upsert-modal";

type Props = {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
};
const AddMore = ({ variant = "ghost" }: Props) => {
  return (
    <UpsertModal
      trigger={
        <Button size="sm" variant={variant} className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          Thêm mới
        </Button>
      }
    />
  );
};

export default AddMore;
