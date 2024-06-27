import React from "react";
import { Button } from "@@/ui/button";
import { Check, Pencil, X } from "lucide-react";

type Props = {
  isEdit: boolean;
  onComplete: () => void;
  onCancel: () => void;
  onDelete: () => void;
  toggleEdit: () => void;
};
const ButtonAction = ({
  isEdit,
  onComplete,
  onCancel,
  onDelete,
  toggleEdit,
}: Props) => {
  return (
    <>
      {isEdit ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={onCancel}
          >
            <X className="h-4 w-4 " />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={onComplete}
          >
            <Check className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={toggleEdit}
          >
            <Pencil className="h-4 w-4 " />
          </Button>
        </>
      )}
    </>
  );
};

export default ButtonAction;
