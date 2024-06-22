import React, { useEffect } from "react";
import { Input } from "@@/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

type Props = {
  value?: string;
  onSearch?: (value: string) => void;
  className?: string;
  placeholder?: string;
};
const Search = ({ value, onSearch, className, placeholder }: Props) => {
  const [searchValue, setSearchValue] = React.useState(value);
  const debounced = useDebouncedCallback(
    // function
    (value) => {
      onSearch?.(value);
    },
    // delay in ms
    1000,
  );

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounced(event.target.value);
    setSearchValue(event.target.value);
  };

  return (
    <Input
      value={searchValue ?? ""}
      onChange={handleOnChange}
      className={cn("h-8", className)}
      placeholder={placeholder}
    />
  );
};

export default Search;
