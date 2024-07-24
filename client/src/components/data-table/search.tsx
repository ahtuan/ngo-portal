import React, { useEffect } from "react";
import { Input } from "@@/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@@/ui/button";
import { SearchIcon } from "lucide-react";

type Props = {
  value?: string;
  onSearch?: (value?: string) => void;
  className?: string;
  placeholder?: string;
};
const Search = ({ value, onSearch, className, placeholder }: Props) => {
  const [searchValue, setSearchValue] = React.useState(value);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchValue) {
      onSearch?.(searchValue);
    }
  };

  return (
    <div className="flex">
      <Input
        value={searchValue ?? ""}
        onChange={handleOnChange}
        className={cn("h-full rounded-r-none", className)}
        placeholder={placeholder}
        onKeyDown={handleOnKeyDown}
      />
      <Button
        size="icon"
        variant="outline"
        onClick={() => searchValue && onSearch?.(searchValue)}
        className="border-l-0 rounded-l-none"
      >
        <SearchIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Search;
