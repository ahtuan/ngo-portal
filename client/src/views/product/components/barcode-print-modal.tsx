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

import { DTPWeb, LPA_JobNames } from "dtpweb";
import html2canvas from 'html2canvas';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const BarcodePrintModal = ({ isOpen, setIsOpen }: Props) => {
  const onPrintBarcode = async () => {

    const api = await DTPWeb.getInstance();
    DTPWeb.checkServer((value) => {
      if (!value) {
          alert("No Detected DothanTech Printer Helper!");
      }
  })
  const width = 30;
  const height = 10;
  const printerName = "P2 Label Printer";
  const text = "202418060001"
  const margin = 1
  if (!api) return;
  api.openPrinter((success) => {
    if (success) {
      api.startJob({
        printerName, 
        width, 
        height
      })
      api.draw1DBarcode({text , 
        width: width, 
        height: height - margin * 4, 
        x: 2, 
        y: margin, 
        barcodeType: 28,
      })
      const textPrice = "25k"
      api.drawText({
        text: text, 
        x: width - 2 * margin, 
        y: 7, 
        fontName: "Arial", 
        fontHeight: 2,
        horizontalAlignment: 2
      })
      api.drawText({
        text: textPrice, 
        x: 1, 
        y: 7, 
        fontName: "Arial", 
        fontHeight: 2,
      })
      api.commitJob(() => api.closePrinter())
    } 
  })
 
}

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
          <Barcode value="2024006070001"/>
        </div>
        <Button onClick={onPrintBarcode}>In</Button>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodePrintModal;

