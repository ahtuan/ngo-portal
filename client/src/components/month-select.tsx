import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import vi from "dayjs/locale/vi";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@@/ui/button";

export type DateRange = {
  from: string;
  to: string;
};

type Props = {
  value?: string;
  onChange?: (dateRange: DateRange) => void;
  className?: string;
  disabled?: boolean;
  preventFuture?: boolean;
};
const MonthSelect = ({
  value,
  onChange,
  className,
  disabled,
  preventFuture,
}: Props) => {
  const [current, setCurrent] = React.useState(dayjs(value).utc(true));

  const getCurrentMonth = () => current.locale(vi).format("MMMM," + " YYYY");
  const handleOnChange = (isForward?: boolean) => {
    let month = current.set("month", current.month() + (isForward ? 1 : -1));
    const format = "YYYY-MM-DD";
    onChange?.({
      from: formatDate(month.startOf("month"), format, true),
      to: formatDate(month.endOf("month"), format, true),
    });
    setCurrent(month);
  };
  return (
    <div
      className={cn(
        "flex p-4 pt-0 items-center justify-between w-full",
        className,
      )}
    >
      <Button
        size="icon"
        variant="outline"
        className={"mr-4 w-6 h-6"}
        onClick={() => handleOnChange()}
        disabled={disabled}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <div className="text-sm font-medium">{getCurrentMonth()}</div>
      <Button
        variant="outline"
        size="icon"
        className={"ml-4 w-6 h-6"}
        disabled={
          disabled ||
          (preventFuture
            ? current.format("YYYY-MM") === formatDate(dayjs(), "YYYY-MM")
            : false)
        }
        onClick={() => handleOnChange(true)}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MonthSelect;
