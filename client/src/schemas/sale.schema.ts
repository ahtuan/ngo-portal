import { z } from "zod";

export const CreateSaleBody = z.object({
  name: z.string().trim().min(1, "Hãy nhập tên của chương trình khuyến mãi"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  isActive: z.boolean(),
  steps: z.string().trim().min(1, "Hãy nhập bước tính khuyến mãi"),
  condition: z.string(),
  useForKgCateIds: z.array(z.string()).optional(),
  isInvoiceOnly: z.boolean(),
});

export namespace ClientSale {
  export type Create = z.TypeOf<typeof CreateSaleBody>;
  export type Item = {
    uuid: string;
    categoriesName?: string;
    price: number | null;
  } & Create;
  export type Update = Partial<{
    useForKgCateIds?: string[];
    isActive: boolean;
  }>;
}
