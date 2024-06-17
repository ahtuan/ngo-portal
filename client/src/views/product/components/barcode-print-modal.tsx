import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@@/ui/dialog";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const BarcodePrintModal = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thành công</DialogTitle>
          <DialogDescription>Tạo sản phẩm thành công</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodePrintModal;
