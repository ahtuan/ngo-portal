import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@@/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { formatCurrency } from "@/lib/utils";

type Props = {
  cost?: number;
};
const PriceTooltip = ({ cost }: Props) => {
  return (
    <div>
      <span>Thành tiền</span>
      {cost ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <InfoCircledIcon className="ml-2 h-4 w-4 cursor-pointer" />{" "}
            </TooltipTrigger>
            <TooltipContent>{formatCurrency(cost, "đ")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </div>
  );
};

export default PriceTooltip;
