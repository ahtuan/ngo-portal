import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@@/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";

type MenuItemProps = {
  icon: React.ReactNode;
  text: string;
  path: string;
  disabled?: boolean;
  active?: boolean;
};
const MenuItem = ({
  icon,
  text,
  path = "#",
  disabled,
  active,
}: MenuItemProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={path}
          className={cn(
            disabled ? "link-disabled" : "",
            "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
            active
              ? "bg-primary text-primary-foreground hover:text-primary-foreground"
              : "",
          )}
        >
          {icon}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{text}</TooltipContent>
    </Tooltip>
  );
};

export default MenuItem;
