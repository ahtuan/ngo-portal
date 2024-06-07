import React from "react";
import { Button } from "@@/ui/button";
import { PlusCircle } from "lucide-react";
import { CardFooter } from "@@/ui/card";

type Props = {
  handleAddMore: () => void;
  disabled: boolean;
};
const AddMore = ({ handleAddMore, disabled }: Props) => {
  return (
    <CardFooter className="justify-center border-t py-2 mx-6 mt-auto">
      <Button
        size="sm"
        variant="ghost"
        className="gap-1"
        onClick={handleAddMore}
        disabled={disabled}
      >
        <PlusCircle className="h-3.5 w-3.5" />
        Thêm mới
      </Button>
    </CardFooter>
  );
};

export default AddMore;
