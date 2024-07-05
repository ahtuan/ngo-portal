export const INVENTORY_ENUM = {
  CREATED: "CREATED", // Chốt đơn và cọc hàng
  DELIVERING: "DELIVERING", // Đang giao hàng
  INSPECTION: "INSPECTION", // Đang soạn hàng
  IN_STOCK: "IN_STOCK", // Hàng đã được soạn và đưa vào kho
  CANCELLED: "CANCELLED",
};

export const PRODUCT_STATUS_ENUM = {
  READY: "READY",
  IN_STOCK: "IN_STOCK",
  SOLD: "SOLD",
};

export const UNIT_ENUM = {
  KG: "KG",
  PCS: "PCS", // Cái hoặc chiếc
};
export const DEFAULT_PAGING = {
  page: 0,
  size: 10,
};

export const INVOICE_STATUS_ENUM = {
  COMPLETE: "COMPLETE",
  CANCELLED: "CANCELLED",
};

export enum PAYMENT_METHOD_ENUM {
  CASH = "CASH",
  BANK = "BANK",
}
