import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PATH } from "@/constants/path";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkActiveRoute(pathName: string, testPath: string) {
  if (pathName === "/" && testPath !== "/") {
    return false;
  }
  return new RegExp(`^${pathName}`).test(testPath);
}

function findPath(parts: string[], obj: any = PATH): Common.Breadcrumb[] {
  // Kiểm tra nếu pathName = "/" thì parts sẽ là ["", ""] thì trực tiếp trả
  // về dashboard
  if (parts.filter(Boolean).length === 0) {
    return [
      {
        path: PATH.dashboard.path,
        text: PATH.dashboard.text,
      },
    ];
  }

  let part = parts[0];
  if (!part) {
    if (parts?.[1] === "setting") {
      part = "setting";
      parts = parts.slice(1);
    } else {
      part = "dashboard";
    }
  }
  const currentObject = obj[part];
  const nextPart = parts[1];

  if (currentObject) {
    // Kiểm tra path hiện tại có route con và có part sau đó
    if (currentObject.routes && nextPart) {
      const result = findPath(parts.slice(1), currentObject.routes);

      if (result) {
        return [
          {
            path: currentObject.path,
            text: currentObject.text,
          },
          ...result,
        ];
      }
    }

    // Kiểm tra nếu part hiện tại bằng current path thì response
    if (currentObject.path.replace(/^\//, "") === part) {
      return [
        {
          path: currentObject.path,
          text: currentObject.text,
        },
      ];
    }
  }
  return [];
}

export function getBreadcrumb(pathName: string) {
  const paths = findPath(pathName.split("/"));
  console.log("paths", paths);
  return paths.reduce((prev, value, index) => {
    if (index === paths.length - 1) {
      return [
        ...prev,
        {
          ...value,
          path: "",
        },
      ];
    }
    const prePath = prev[index - 1]?.path || "";
    return [
      ...prev,
      {
        text: value.text,
        path: (prePath === "/" ? "" : prePath) + value.path,
      },
    ];
  }, [] as Array<Common.Breadcrumb>);
}

export const formatCurrency = (
  input: string | number | readonly string[] | undefined,
  currency?: string,
) => {
  if (!input) {
    if (currency) {
      return `0 ${currency}`;
    }
    return "";
  }
  let formattedValue = input.toString().replace(/[^0-9.-]+/g, "");
  formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (formattedValue.includes(".")) {
    const [dollars, cents] = formattedValue.split(".");
    formattedValue = `${dollars}.${cents.slice(0, 2)}`;
  }
  return formattedValue + (currency ? `${currency}` : "");
};

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const formatPrice = (price: number) => {
  const units = ["", "K", "M", "B", "T"];
  const unitIndex = Math.floor(Math.log10(Math.abs(price)) / 3);

  // Tính giá trị rút gọn
  let shortValue = (price / Math.pow(1000, unitIndex)).toFixed(1);

  // Loại bỏ ".0" nếu có
  if (shortValue.endsWith(".0")) {
    shortValue = shortValue.slice(0, -2);
  }

  return `${shortValue}${units[unitIndex]}`;
};

export const getQueryString = (query: any, page?: number) => {
  if (!query.page) {
    query.page = 1;
  }
  return Object.entries(query)
    .map(([key, value]) => `${key}=${key === "page" && page ? page : value}`)
    .join("&");
};

export const generateSearchParams = (query: string) => {
  const searchParams = new URLSearchParams(query);
  return Object.fromEntries(searchParams.entries());
};

export const getDirtyValues = <T extends {}>(
  allValue: T,
  originalValue: any,
) => {
  // Update form
  const payload: Partial<T> = {
    ...allValue,
  };

  Object.entries(allValue).map(([key, value]) => {
    if (value?.toString() === originalValue[key]?.toString()) {
      // @ts-ignore
      delete payload[key];
    }
  });

  return payload;
};

export const fixed = (value: number, decimals: number = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

export const formatDate = (
  date: string,
  format: string = "YYYY-MM-DD HH:mm",
) => {
  return dayjs(date).format(format);
};
