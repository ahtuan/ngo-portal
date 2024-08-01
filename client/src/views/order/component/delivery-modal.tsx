import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@@/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { useForm } from "react-hook-form";
import { Invoice, InvoiceDeliverySchema } from "@/schemas/invoice.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceRequest } from "@/api-requests/invoice.request";
import Currency from "@@/currency";
import { Button } from "@@/ui/button";
import { Input } from "@@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/ui/select";
import { PAYMENT_TYPE } from "@/constants/enums";

type Props = {
  onClose: () => void;
  byDateId: string;
  refresh: () => void;
};
const RefundModal = ({ onClose, byDateId, refresh }: Props) => {
  const form = useForm<Invoice.Delivery>({
    resolver: zodResolver(InvoiceDeliverySchema),
    defaultValues: {
      orderCode: "",
    },
  });

  const handleSubmit = async (values: Invoice.Delivery) => {
    try {
      await invoiceRequest.delivery(byDateId, values);
      await refresh();
      onClose();
    } catch {}
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[70dvw]">
        <DialogHeader>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="mx-auto grid lg:max-w-[64rem] w-full flex-1 auto-rows-max gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="orderCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã vận đơn</FormLabel>
                  <Input {...field} onKeyDown={onKeyDown} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tiền vận chuyển (khoảng chênh lệch với 30k)
                  </FormLabel>
                  <Currency {...field} onKeyDown={onKeyDown} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương thức thanh toán</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phương thức thanh toán" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PAYMENT_TYPE).map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant={"outline"} onClick={onClose}>
                Huỷ
              </Button>
              <Button type="submit">Xác nhận</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RefundModal;
