import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@@/ui/dialog";
import Barcode from "react-barcode";
import { Button } from "@@/ui/button";
import html2canvas from "html2canvas";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const BarcodePrintModal = ({ isOpen, setIsOpen }: Props) => {
  const onPrintBarcode = () => {
    const mySVG = document.getElementById("barcode-canvas");
    const width = "1000px";
    const height = "700px";
    const printWindow = window.open(
      "",
      "PrintMap",
      "width=" + width + ",height=" + height,
    );
    printWindow?.document.writeln(mySVG?.innerHTML || "");
    printWindow?.document.close();
    printWindow?.print();
    printWindow?.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thành công</DialogTitle>
          <DialogDescription>
            Tạo sản phẩm thành công với mã:{" "}
          </DialogDescription>
        </DialogHeader>
        <div id="barcode-canvas">
          <Barcode value="2024006070001" />
        </div>
        <Button onClick={onPrintBarcode}>In</Button>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodePrintModal;
