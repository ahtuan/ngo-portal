import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@@/ui/popover";
import { Button } from "@@/ui/button";
import { Separator } from "@@/ui/separator";
import { Badge } from "@@/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@@/ui/command";

type FacetedFilterProps = {
  title?: string;
  options: Common.Option[];
  selectedValues: string[];
  onFilter?: (value: string[]) => void;
};

export const FacetedFilter = ({
  title,
  options,
  selectedValues,
  onFilter,
}: FacetedFilterProps) => {
  const [selectedOptions, setSelectedOptions] =
    React.useState<string[]>(selectedValues);

  const handleOnChange = (value: boolean) => {
    if (selectedValues !== selectedOptions) {
      setSelectedOptions(selectedValues);
    }
  };

  return (
    <Popover onOpenChange={handleOnChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) =>
                      selectedOptions.some((value) => value === option.value),
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedOptions.some(
                  (value) => value === option.value,
                );
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      let newOptions = [];
                      if (isSelected) {
                        newOptions = selectedOptions.filter(
                          (value) => value !== option.value,
                        );
                      } else {
                        newOptions = [...selectedOptions, option.value];
                      }
                      setSelectedOptions(newOptions);
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedOptions.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onFilter?.(selectedOptions);
                    }}
                    className="justify-center text-center"
                  >
                    Lọc
                  </CommandItem>
                  <CommandItem
                    onSelect={() => {
                      setSelectedOptions([]);
                      onFilter?.([]);
                    }}
                    className="justify-center text-center"
                  >
                    Xoá lọc
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
