"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@@/ui/dialog";
import { InventoryType } from "@/schemas/inventory.schema";
import UpsertForm from "@views/inventory/components/upsert-form";
import { useEffect, useState } from "react";

type Props = {
  trigger?: React.ReactNode;
  data?: InventoryType;
  setUpdatedData?: (update?: InventoryType) => void;
};

const UpsertModal = ({ trigger, data, setUpdatedData }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setIsOpen(true);
    }
  }, [data]);

  const getTitle = () => {
    if (data) {
      return "Lô: " + data.id;
    }
    return "Tạo mới";
  };

  const handleOnClose = () => {
    setIsOpen(false);
    setUpdatedData?.(); // reset data after update
  };

  const handleOnChangeOpen = (open: boolean) => {
    if (open) {
      setIsOpen(true);
    } else {
      handleOnClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnChangeOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin tại đây và nhấn &ldquo;Lưu&rdquo; để hoàn tất.
          </DialogDescription>
        </DialogHeader>
        {isOpen && <UpsertForm onClose={handleOnClose} data={data} />}
      </DialogContent>
    </Dialog>
  );
};

export default UpsertModal;
