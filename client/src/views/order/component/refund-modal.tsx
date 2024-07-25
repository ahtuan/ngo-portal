import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@@/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@@/ui/form";
import { useForm } from "react-hook-form";
import { Invoice, InvoiceRefundSchema } from "@/schemas/invoice.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceRequest } from "@/api-requests/invoice.request";
import Currency from "@@/currency";
import { Textarea } from "@@/ui/textarea";
import { Button } from "@@/ui/button";

type Props = {
  onClose: () => void;
  note?: string;
  byDateId: string;
  amount: number;
  refresh: () => void;
};
const RefundModal = ({ onClose, note, byDateId, refresh, amount }: Props) => {
  const form = useForm<Invoice.Refund>({
    resolver: zodResolver(InvoiceRefundSchema),
    defaultValues: {
      amount: amount,
      note: note,
    },
  });

  const validateForm = (value: number) => {
    if (value > amount) {
      form.setError("amount", {
        message: "Số tiền hoàn không được lớn hơn giá trị đơn hàng",
      });
      return false;
    }
    form.trigger("amount");
    return true;
  };

  const handleSubmit = async (values: Invoice.Refund) => {
    try {
      if (!validateForm(values.amount)) {
        return;
      }
      await invoiceRequest.refund(byDateId, values);
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền cần hoàn</FormLabel>
                  <Currency
                    {...field}
                    onKeyDown={onKeyDown}
                    onChange={(event) => {
                      field.onChange(event);
                      validateForm(+event.target.value);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <Textarea {...field} />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant={"outline"} onClick={onClose}>
                Huỷ
              </Button>
              <Button type="submit">Hoàn tiền</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RefundModal;
