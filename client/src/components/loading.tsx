import React from "react";
import { cn } from "@/lib/utils";
import { className } from "postcss-selector-parser";

type Props = {
  size?: "small" | "medium" | "large";
  className?: string;
};

const Loading = ({ size = "medium", className }: Props) => {
  const getSize = () => {
    let className = "";
    switch (size) {
      case "small":
        className = "w-4 h-4";
        break;
      case "medium":
        className = "w-8 h-8";
        break;
      case "large":
        className = "w-10 h-10";
        break;
    }
    return className;
  };

  return (
    <div className={cn("flex items-center justify-center min-h-12", className)}>
      <div
        className={cn(
          getSize(),
          "border-4 border-gray-300 border-t-gray-900 rounded-full" +
            " animate-spin",
        )}
      />
    </div>
  );
};

export default Loading;
