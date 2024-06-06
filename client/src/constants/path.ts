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
        disabled: true,
      },
      product: {
        path: "/product",
        text: "Sản phẩm",
        routes: {
          inventory: {
            text: "Lô hàng",
            path: "/inventory",
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
    disabled: true,
  },
};
