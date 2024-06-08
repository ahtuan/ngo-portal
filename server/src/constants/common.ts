export const INVENTORY_ENUM = {
  CREATED: "CREATED", // Chốt đơn và cọc hàng
  DELIVERING: "DELIVERING", // Đang giao hàng
  INSPECTION: "INSPECTION", // Đang soạn hàng
  IN_STOCK: "IN_STOCK", // Hàng đã được soạn và đưa vào kho
  CANCELLED: "CANCELLED",
};

export const DEFAULT_PAGING = {
  page: 0,
  size: 10,
};
