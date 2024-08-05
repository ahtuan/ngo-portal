import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@@/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@@/ui/form";
import { useForm } from "react-hook-form";
import { Invoice, InvoiceKeepSchema } from "@/schemas/invoice.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceRequest } from "@/api-requests/invoice.request";
import { Textarea } from "@@/ui/textarea";
import { Button } from "@@/ui/button";

type Props = {
  onClose: () => void;
  note?: string;
  byDateId: string;
  refresh: () => void;
};
const KeepModal = ({ onClose, note, byDateId, refresh }: Props) => {
  const form = useForm<Invoice.Keep>({
    resolver: zodResolver(InvoiceKeepSchema),
    defaultValues: {
      note: note,
    },
  });

  const handleSubmit = async ({ note }: Invoice.Keep) => {
    try {
      await invoiceRequest.keep(byDateId, note);
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
              <Button type="submit">Giữ hàng</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default KeepModal;
