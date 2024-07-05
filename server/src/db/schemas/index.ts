import * as authSchema from "./auth.schema";
import * as inventorySchema from "./inventory.schema";
import * as categorySchema from "./category.schema";
import * as productSchema from "./product.schema";
import * as invoiceSchema from "./invoice.schema";

export default {
  ...authSchema,
  ...inventorySchema,
  ...categorySchema,
  ...productSchema,
  ...invoiceSchema,
};
