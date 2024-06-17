import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@@/ui/form";

type Props = {
  children: React.ReactNode;
  label: string;
};

const Item = ({ children, label }: Props) => {
  return (
    <FormItem className="sm:grid sm:grid-cols-4 sm:items-baseline sm:gap-4">
      <FormLabel className="sm:text-right">{label}</FormLabel>
      <div className="grid sm:col-span-3 gap-1">
        <FormControl>{children}</FormControl>
        <FormMessage />
      </div>
    </FormItem>
  );
};

export default Item;
