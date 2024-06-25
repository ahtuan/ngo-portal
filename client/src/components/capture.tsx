import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@@/ui/dialog";
import { Camera } from "react-camera-pro";
import { Aperture } from "lucide-react";
import { Button } from "@@/ui/button";
import Image from "next/image";

type Props = {
  children?: React.ReactNode;
  onChange?: (value: string) => void;
};
const Capture = ({ children, onChange }: Props) => {
  const [open, setOpen] = React.useState(false);
  const camera = useRef();
  const [image, setImage] = useState();
  const [preview, setPreview] = useState(false);

  const takePicture = () => {
    // @ts-ignore
    const photo = camera?.current?.takePhoto();
    setImage(photo);
    setPreview(true);
  };

  const reset = (open: boolean = false) => {
    if (!open) {
      setImage(undefined);
      setPreview(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        reset(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[80vw] h-[80dvh]">
        <div onClick={takePicture}>
          <Camera
            ref={camera}
            aspectRatio="cover"
            facingMode="environment"
            errorMessages={{
              noCameraAccessible:
                "No camera device accessible. Please connect your camera or try a different browser.",
              permissionDenied:
                "Permission denied. Please refresh and give camera permission.",
              switchCamera:
                "It is not possible to switch camera to different one because there is only one video device accessible.",
              canvas: "Canvas is not supported.",
            }}
          />
          {preview && image && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-white z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={image}
                alt="preview photo"
                className="object-cover w-full"
              />
              <div className="flex justify-center fixed bottom-0 w-full gap-3 p-4">
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    reset();
                  }}
                >
                  Chụp lại
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                    setPreview(false);
                    onChange?.(image);
                  }}
                >
                  Lưu
                </Button>
              </div>
            </div>
          )}
          <div className="fixed right-0 top-0 w-20 bg-primary/30 h-full  flex items-center justify-center">
            <button onClick={takePicture}>
              <Aperture className="w-10 h-10 z-10 text-primary-foreground" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Capture;
