import z from "zod";

export const CategoryBody = z.object({
  uuid: z.string(),
  name: z.string().trim().min(1, "Tên không được trống"),
  price: z.number().min(1000, "Giá ít nhất là một ngàn đồng"),
  unit: z.optional(z.string()),
});

export type CategoryType = z.TypeOf<typeof CategoryBody>;
