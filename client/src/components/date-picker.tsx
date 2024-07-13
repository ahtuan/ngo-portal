import React from "react";
import { Calendar, CalendarProps } from "@@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value?: string;
} & CalendarProps;

const DatePicker = ({ value, ...props }: DatePickerProps) => {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          {value ? value : <span>Chọn ngày</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar {...props} />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
