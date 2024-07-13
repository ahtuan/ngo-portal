import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@@/ui/tooltip";
import { Tag } from "lucide-react";
import { Invoice } from "@/schemas/invoice.schema";
import { CardDescription, CardTitle } from "@@/ui/card";
import { cn } from "@/lib/utils";

const Sale = ({ name, description, isApplied }: Invoice.Sale) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={(event) => event.preventDefault()}>
          <Tag
            className={cn(
              "h-4 w-4 rotate-90 ml-1",
              isApplied ? "text-green-500" : "text-muted-foreground",
            )}
          />
        </TooltipTrigger>
        <TooltipContent>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Sale;
