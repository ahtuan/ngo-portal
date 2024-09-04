import React from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { formatCurrency } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";

type Props = {
  cost?: number;
};
const PriceTooltip = ({ cost }: Props) => {
  return (
    <div
      onFocusCapture={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <span>Thành tiền</span>
      {cost ? (
        <Popover>
          <PopoverTrigger>
            <InfoCircledIcon className="ml-2 h-4 w-4 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent>{formatCurrency(cost, "đ")}</PopoverContent>
        </Popover>
      ) : null}
    </div>
  );
};

export default PriceTooltip;
