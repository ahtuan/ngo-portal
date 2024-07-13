import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@@/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientSale, CreateSaleBody } from "@/schemas/sale.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@@/ui/form";
import { Input } from "@@/ui/input";
import DatePicker from "@@/date-picker";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Switch } from "@@/ui/switch";
import { Card, CardContent } from "@@/ui/card";
import { Checkbox } from "@@/ui/checkbox";
import { Label } from "@@/ui/label";
import { saleRequest } from "@/api-requests/sale.request";
import { useToast } from "@@/ui/use-toast";

type Props = {
  onClose: () => void;
  options: Common.Option[];
};
const CreateModal = ({ onClose, options }: Props) => {
  const { toast } = useToast();
  const form = useForm<ClientSale.Create>({
    resolver: zodResolver(CreateSaleBody),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: undefined,
      isActive: true,
      useForKgCateIds: [],
      isInvoiceOnly: false,
      condition: "",
      steps: "",
    },
  });

  const isInvoiceOnly = form.watch("isInvoiceOnly");

  const handleCheckedChange = (checked: boolean | string, value: string) => {
    let useForKgCateIds = form.getValues("useForKgCateIds") || [];
    if (checked) {
      useForKgCateIds.push(value);
    } else {
      useForKgCateIds = useForKgCateIds.filter((id) => id !== value);
    }
    form.setValue("useForKgCateIds", useForKgCateIds);
  };
  const handleSubmit = async (values: ClientSale.Create) => {
    try {
      await saleRequest.create(values);
      onClose();
    } catch {
      toast({
        description: "Có lỗi trong quá trình tạo thêm khuyến mãi",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[70dvw]">
        <DialogHeader>
          <DialogTitle>Tạo mới khuyến mãi</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="mx-auto grid lg:max-w-[64rem] w-full flex-1 auto-rows-max gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bước tính</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điều kiện</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <br />
                    <DatePicker
                      value={formatDate(field.value, "YYYY-MM-DD")}
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <br />
                    <DatePicker
                      value={
                        field.value
                          ? formatDate(field.value, "YYYY-MM-DD")
                          : undefined
                      }
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={(date) => date < form.getValues("startDate")}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isInvoiceOnly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mr-2">Áp dụng trên tổng đơn</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(check) => {
                        if (!check) {
                          form.setValue("useForKgCateIds", []);
                        }
                        field.onChange(check);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="useForKgCateIds"
              render={({ field }) => (
                <FormItem className={isInvoiceOnly ? "hidden" : "visible"}>
                  <FormLabel>Áp dụng với phân loại</FormLabel>
                  <Card>
                    <CardContent className="grid grid-cols-4 gap-4 p-4">
                      {options.map((option, index) => (
                        <div key={index} className="space-x-1">
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            id={`categoryId-${index}`}
                            onCheckedChange={(checked) => {
                              handleCheckedChange(checked, option.value);
                            }}
                          />
                          <Label htmlFor={`categoryId-${index}`}>
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mr-2">Sử dụng</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type={"submit"}>Tạo</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;
