export const PATH = {
  dashboard: {
    text: "Bảng điều khiển",
    path: "/",
    routes: {
      customer: {
        path: "/customer",
        text: "Khách hàng",
        disabled: true,
      },
      order: {
        path: "/order",
        text: "Đơn hàng",
        routes: {
          create: {
            path: "/create",
            text: "Tạo mới",
          },
          online: {
            path: "/online",
            text: "Trực tuyến",
          },
        },
        disabled: false,
      },
      product: {
        path: "/product",
        text: "Sản phẩm",
        routes: {
          inventory: {
            text: "Lô hàng",
            path: "/inventory",
            routes: {
              upsert: {
                text: "Tạo mới",
                path: "/upsert",
              },
            },
          },
          create: {
            text: "Nhập sản phẩm mới",
            path: "/create",
          },
        },
        disabled: false,
      },
      report: {
        path: "/report",
        text: "Báo cáo",
        disabled: true,
      },
    },
  },
  setting: {
    path: "/setting",
    text: "Cài đặt",
    disabled: false,
    routes: {
      sale: {
        path: "/sale",
        text: "Khuyến mãi",
      },
      category: {
        path: "/category",
        text: "Phân loại",
      },
    },
  },
};

const baseInventory = "/product/inventory";
export const InventoryPath = {
  Base: baseInventory,
  Upsert: `${baseInventory}/upsert`,
};

const baseProduct = "/product";
export const ProductPath = {
  Base: baseProduct,
  Create: `${baseProduct}/create`,
  Update: (byDateId: string) =>
    `${baseProduct}/${byDateId}?time=${new Date().getTime()}`,
};

const baseOrder = "/order";
export const OrderPath = {
  Base: baseOrder,
  Create: `${baseOrder}/create`,
  Online: `${baseOrder}/online`,
  Update: (byDateId: string) =>
    `${baseOrder}/${byDateId}?time=${new Date().getTime()}`,
};

const baseSetting = "/setting";
export const SettingPath = {
  Base: baseSetting,
  Category: `${baseSetting}/category`,
  Sale: `${baseSetting}/sale`,
};
