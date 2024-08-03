export const InventoryStatus = {
  CREATED: { value: "CREATED", label: "Cọc hàng" }, // Chốt đơn và cọc hàng
  DELIVERING: { value: "DELIVERING", label: "Đang giao hàng" }, // Đã nhận được
  // hàng
  INSPECTION: { value: "INSPECTION", label: "Soạn hàng" }, // Đang soạn hàng
  IN_STOCK: { value: "IN_STOCK", label: "Đang trong kho" }, // Hàng đã được soạn
  // và đưa vào kho
  CANCELLED: { value: "CANCELLED", label: "Huỷ" },
};

export const ProductStatus = {
  IN_STOCK: { value: "IN_STOCK", label: "Kho" },
  READY: { value: "READY", label: "Trưng bày" },
  SOLD: { value: "SOLD", label: "Đã hết" },
};

export const OrderStatus = {
  PENDING: { value: "PENDING", label: "Đang chờ" },
  PREPARED: { value: "PREPARED", label: "Soạn hàng" },
  DELIVERING: { value: "DELIVERING", label: "Đang vận chuyển" },
  COMPLETED: { value: "COMPLETE", label: "Thành công" },
  REFUNDED: { value: "REFUNDED", label: "Hoàn tiền" },
  CANCELLED: { value: "CANCELLED", label: "Huỷ" },
};

export enum PaymentStatus {
  COMPLETE = "COMPLETE",
  PENDING = "PENDING",
  REFUNDED = "REFUNDED",
}

export enum PaymentType {
  DEPOSIT = "DEPOSIT",
  REMAINING = "REMAINING",
  FULL = "FULL",
  REFUNDED = "REFUNDED",
  SHIPPING_FEE = "SHIPPING_FEE",
}
