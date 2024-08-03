import React from "react";
import { Calendar, CalendarProps } from "@@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@@/ui/label";
import { RadioGroup, RadioGroupItem } from "@@/ui/radio-group";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";

type DatePickerProps = {
  value?: string;
  relative?: boolean;
} & CalendarProps;

const relativeOption: Common.Option[] = [
  {
    label: "Hôm nay",
    value: "today",
  },
  {
    label: "Hôm qua",
    value: "yesterday",
  },
  {
    label: "7 ngày trước",
    value: "7_days",
  },
  {
    label: "Tháng này",
    value: "month",
  },
  {
    label: "Tháng trước",
    value: "pre_month",
  },
];
const DatePicker = ({ value, relative, ...props }: DatePickerProps) => {
  const onRelativeChange = (value: string) => {
    let dateRange: DateRange = {
      from: undefined,
      to: undefined,
    };
    const today = new Date();
    switch (value) {
      case "today":
        dateRange.from = today;
        break;
      case "yesterday":
        dateRange.from = dayjs()
          .set("date", today.getDate() - 1)
          .toDate();
        break;
      case "7_days":
        dateRange.from = dayjs()
          .set("date", today.getDate() - 7)
          .toDate();
        dateRange.to = today;
        break;
      case "month":
        dateRange.from = dayjs().set("date", 1).toDate();
        dateRange.to = today;
        break;
      case "pre_month":
        dateRange.from = dayjs()
          .set("month", today.getMonth() - 1)
          .set("date", 1)
          .toDate();
        dateRange.to = dayjs()
          .set("month", today.getMonth() - 1)
          .endOf("month")
          .toDate();
        props.month = dateRange.from;
        break;
    }
    // @ts-ignore
    props.onSelect(dateRange);
  };
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
      <PopoverContent className={`w-auto p-0`} align="start">
        <div className="flex">
          <Calendar {...props} />
          {relative && (
            <RadioGroup
              className="flex flex-col mt-10 p-4"
              onValueChange={onRelativeChange}
            >
              {relativeOption.map(({ label, value }) => (
                <div
                  key={`option-${value}`}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem id={`option-${value}`} value={value} />
                  <Label htmlFor={`option-${value}`} className={"font-normal"}>
                    {" "}
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
