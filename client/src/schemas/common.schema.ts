import z from "zod";

export const price = z.coerce
  .number({
    message: "Giá phải it nhất là 1 ngàn đồng",
  })
  .min(1000, "Giá phải it nhất là 1" + " ngàn đồng");
export const weight = z.coerce
  .number({
    message: "Cân nặng phải lớn hơn 0",
  })
  .refine((value) => value > 0, "Cân nặng phải lớn hơn 0");
