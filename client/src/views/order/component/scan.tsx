import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@@/ui/card";
import Html5QrcodePlugin from "@@/Html5QrcodePlugin";
import { Input } from "@@/ui/input";
import { Button } from "@@/ui/button";
import { ListPlus } from "lucide-react";
import { Label } from "@@/ui/label";
import useSWRMutation from "swr/mutation";
import { productRequest } from "@/api-requests/product.request";
import { useToast } from "@@/ui/use-toast";
import { ProductDetail } from "@/schemas/product.schema";

type Props = {
  onAppend: (data: ProductDetail) => void;
};
const Scan = ({ onAppend }: Props) => {
  const [id, setId] = React.useState<string>("");
  const { toast } = useToast();
  const { trigger: fetcher } = useSWRMutation(
    id ? id : undefined,
    productRequest.getDetail,
    {
      onError: (err, key, config) => {
        toast({
          description: err.message,
        });
      },
      onSuccess: (data) => {
        if (data) {
          onAppend(data);
        }
        setId("");
      },
    },
  );
  const onNewScanResult = (decodedText: string) => {
    if (decodedText && decodedText !== id) {
      setId(decodedText);
    }
  };

  const handleAddToItemList = () => {
    if (id) {
      // @ts-ignore
      fetcher(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm sản phẩm</CardTitle>
        <CardDescription>
          Quét mã sản phẩm hoặc nhập ở khung bên dưới để thêm vào danh sách
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Html5QrcodePlugin
          fps={10}
          disableFlip={true}
          qrCodeSuccessCallback={onNewScanResult}
          className="max-h-[40dvh]"
        />
        <div className="grid gap-2 mt-2">
          <Label htmlFor="itemId">Mã sản phẩm</Label>
          <Input
            value={id}
            onChange={(e) => setId(e.currentTarget.value)}
            placeholder="Nhập mã sản phẩm"
            name="itemId"
          />
          <Button
            variant="outline"
            onClick={(event) => {
              event.preventDefault();
              handleAddToItemList();
            }}
          >
            <ListPlus className="mr-1" />
            Thêm vào danh sách
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Scan;
