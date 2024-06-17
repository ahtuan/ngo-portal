import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@@/ui/alert-dialog";
import Link from "next/link";
import { InventoryPath, ProductPath } from "@/constants/path";

const NoInventoryDialog = () => {
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Không thể nhập sản phẩm nếu không có thông tin lô hàng.
          </AlertDialogTitle>
          <AlertDialogDescription>
            Nhấn &ldquo;Lô hàng&rdquo; và chọn lô tương ứng để tiếp tục nhập sản
            phẩm <br />
            Hoặc chọn &ldquo;Trở về&rdquo; để quay lại trang sản phẩm
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Link href={ProductPath.Base}>Trở về</Link>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href={InventoryPath.Base}>Lô hàng</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NoInventoryDialog;
