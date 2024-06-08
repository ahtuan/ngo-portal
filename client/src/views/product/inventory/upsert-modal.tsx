"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InventoryType } from "@/schemas/inventory.schema";
import UpsertForm from "@views/product/inventory/upsert-form";
import { useState } from "react";

type Props = {
  trigger: React.ReactNode;
  data?: InventoryType;
};

const UpsertModal = ({ trigger, data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const getTitle = () => {
    if (data) {
      return "Lô: " + data.id;
    }
    return "Tạo mới";
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin tại đây và nhấn "Lưu" để hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <UpsertForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default UpsertModal;
