import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@@/ui/button";
import { X } from "lucide-react";

type Props = {
  removeHandler?: () => void;
  src: string;
  width: number;
  height: number;
  className?: string;
};

const DisplayImage = (props: Props) => {
  const { className, src, removeHandler, height, width } = props;

  return (
    <div className="group relative">
      <Image
        alt="Product image"
        className={cn(
          "aspect-square w-full rounded-md object-cover",
          className,
        )}
        src={src ?? "/images/placeholder.svg"}
        width={width}
        height={height}
      />
      <X
        className={`
          w-4 h-4 absolute right-2 top-2 cursor-pointer text-muted-foreground hover:text-accent-foreground hidden ${
            src ? "group-hover:block" : ""
          }
        `}
        onClick={removeHandler}
      />
    </div>
  );
};

export default DisplayImage;
