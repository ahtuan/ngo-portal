import React from "react";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@@/ui/hover-card";

type Props = {
  src?: string;
  hoverContent?: React.ReactNode;
  className?: string;
};

const DisplayImage = ({ src, hoverContent, className }: Props) => {
  if (!src) {
    return (
      <Image
        src="/images/placeholder.svg"
        width={32}
        height={32}
        alt="Product image"
        className="rounded"
      />
    );
  }
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Image
          src={src}
          width={32}
          height={32}
          alt="Product image"
          className={`rounded ${className}`}
        />
      </HoverCardTrigger>
      <HoverCardContent side="right">
        <Image
          src={src}
          width={32}
          height={32}
          alt="Product image"
          className="w-64 rounded"
        />
        {hoverContent}
      </HoverCardContent>
    </HoverCard>
  );
};

export default DisplayImage;
