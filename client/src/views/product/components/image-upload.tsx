import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@@/ui/card";
import { Aperture } from "lucide-react";
import Capture from "@@/capture";
import { CardItemProps } from "@views/product/upsert";
import DisplayImage from "@views/product/components/display-image";
import { FormField } from "@@/ui/form";

const ImageUpload = ({ form }: CardItemProps) => {
  const [image, setImage] = useState<string[]>([]);

  const images = form.watch("imageUrls");

  useEffect(() => {
    if (!images?.length) {
      setImage([]);
    } else {
      setImage(images);
    }
  }, [images]);

  const onCapture = (value: string) => {
    const newImages = [...image, value];

    setImage(newImages);
    form.setValue("imageUrls", newImages);
  };

  const onRemove = (index: number) => {
    const newImages = image.filter((item, i) => i !== index);
    form.setValue("imageUrls", newImages);
    setImage(newImages);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Trực quan sản phẩm</CardTitle>
        <CardDescription>
          Chỉ được phép upload tối đa 3 tấm hình
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="imageUrls"
          render={(field) => (
            <div className="grid gap-2">
              <DisplayImage
                removeHandler={() => onRemove(0)}
                src={image[0]}
                height={300}
                width={300}
              />
              <div className="grid grid-cols-3 gap-2">
                <DisplayImage
                  removeHandler={() => onRemove(1)}
                  src={image[1]}
                  width={84}
                  height={84}
                />
                <DisplayImage
                  removeHandler={() => onRemove(2)}
                  src={image[2]}
                  width={84}
                  height={84}
                />

                <Capture onChange={onCapture}>
                  <button
                    className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                    disabled={image.length > 2}
                  >
                    <Aperture className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Upload</span>
                  </button>
                </Capture>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
