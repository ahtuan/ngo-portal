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
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
  DELIVERING: "DELIVERING",
  PREPARED: "PREPARED",
};

export enum PAYMENT_METHOD_ENUM {
  CASH = "CASH",
  BANK = "BANK",
}

export enum PAYMENT_STATUS {
  COMPLETE = "COMPLETE",
  PENDING = "PENDING",
  REFUNDED = "REFUNDED",
}

export enum PAYMENT_TYPE {
  DEPOSIT = "DEPOSIT",
  REMAINING = "REMAINING",
  FULL = "FULL",
  REFUNDED = "REFUNDED",
  SHIPPING_FEE = "SHIPPING_FEE",
}

export const MATERIAL_TYPE = {
  CERAMIC: { label: "Gốm", value: "CERAMIC" },
  GLASS: { label: "Thuỷ tinh", value: "GLASS" },
  WOOD: { label: "Gỗ", value: "WOOD" },
};
