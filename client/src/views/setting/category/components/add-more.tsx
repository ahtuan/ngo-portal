import React from "react";
import { Button } from "@@/ui/button";
import { PlusCircle } from "lucide-react";

type Props = {
  handleAddMore: () => void;
  disabled: boolean;
};
const AddMore = ({ handleAddMore, disabled }: Props) => {
  return (
    <Button
      size="sm"
      className="gap-1 absolute right-4 top-4"
      onClick={handleAddMore}
      disabled={disabled}
    >
      <PlusCircle className="h-3.5 w-3.5" />
      Thêm mới
    </Button>
  );
};

export default AddMore;
