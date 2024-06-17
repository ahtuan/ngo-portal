import React from "react";
import { Button } from "@@/ui/button";
import { Pencil, Trash, X, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@@/ui/alert-dialog";

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
            className="hover:scale-[115%] transition-all"
            onClick={onCancel}
          >
            <X className="h-4 w-4 " />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:scale-[115%] transition-all"
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
            className="hover:scale-[115%] transition-all"
            onClick={toggleEdit}
          >
            <Pencil className="h-4 w-4 " />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-[115%] transition-all"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có muốn xoá phân loại này?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Xoá</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
};

export default ButtonAction;
