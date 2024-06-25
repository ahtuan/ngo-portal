import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@@/ui/hover-card";

type Props = {
  removeHandler?: () => void;
  src: string;
  width: number;
  height: number;
  className?: string;
  hoverAble?: boolean;
};

const ImageRender = ({ className, src, height, width }: Props) => {
  return (
    <Image
      alt="Product image"
      className={cn("aspect-square w-full rounded-md object-cover", className)}
      src={src ?? "/images/placeholder.svg"}
      width={width}
      height={height}
    />
  );
};

const DisplayImage = (props: Props) => {
  const { className, src, removeHandler, height, width, hoverAble } = props;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="group relative">
          <ImageRender
            src={src}
            width={width}
            height={height}
            className={className}
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
      </HoverCardTrigger>
      {hoverAble && src && (
        <HoverCardContent side="left">
          <ImageRender
            src={src}
            width={width}
            height={height}
            className="w-64 rounded"
          />
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default DisplayImage;
