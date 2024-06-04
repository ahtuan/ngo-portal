export const PATH = {
  dashboard: {
    text: "Bảng điều khiển",
    path: "/",
    routes: {
      customer: {
        path: "/customer",
        text: "Khách hàng",
      },
      order: {
        path: "/order",
        text: "Đơn hàng",
      },
      product: {
        path: "/product",
        text: "Sản phẩm",
        routes: {
          inventory: {
            text: "Lo hang",
            path: "/inventory",
            routes: {
              test: {
                text: "test",
                path: "/test",
              },
            },
          },
        },
      },
      report: {
        path: "/report",
        text: "Báo cáo",
      },
    },
  },
  setting: {
    path: "/setting",
    text: "Cài đặt",
  },
};
