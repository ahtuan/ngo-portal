import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PATH } from "@/constants/path";
import dayjs from "dayjs";
import { Parser, Value } from "expr-eval";

import utc from "dayjs/plugin/utc"; // import utc from 'dayjs/plugin/utc' // ES
// 2015
// import utc from 'dayjs/plugin/utc' // ES 2015
// import timezone from 'dayjs/plugin/timezone' // ES 2015

dayjs.extend(utc);

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

export const formatPrice = (price?: number) => {
  if (!price) {
    return price?.toString() || "0";
  }
  const units = ["đ", "K", "M", "B", "T"];
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
export const getQueryChanged = (
  name: string,
  value: string[],
  queryString: string,
) => {
  const joinedValue = value.join(";");

  let gencParams = generateSearchParams(queryString);
  gencParams[name] = joinedValue;
  gencParams.page = "1";
  const queryChangedString = Object.entries(gencParams)
    .map(([key, value]) =>
      value ? `${key}=${key === name ? joinedValue : value}` : "",
    )
    .filter(Boolean)
    .join("&");
  return queryChangedString;
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
  date?: string | Date | dayjs.Dayjs,
  format: string = "YYYY-MM-DD HH:mm",
  utc: boolean = false,
) => {
  return dayjs(date).utc(utc).format(format);
};

const weekdayVietnamese = {
  Mon: "Thứ 2",
  Tue: "Thứ 3",
  Wed: "Thứ 4",
  Thu: "Thứ 5",
  Fri: "Thứ 6",
  Sat: "Thứ 7",
  Sun: "Chủ Nhật",
};
export const formatDateFromUTC = (
  date: string | Date,
  format: string = "YYYY-MM-DD HH:mm",
) => {
  if (date) {
    let formated = dayjs(date).format(format);
    if (format === "ddd, YYYY-MM-DD HH:mm") {
      let [weekdays, time] = formated.split(",");
      // @ts-ignore
      formated = weekdayVietnamese[weekdays] + ", " + time;
    }
    return formated;
  }
  return;
};

export const evaluateExp = (
  expression?: string | null,
  values?: Value | undefined,
) => {
  if (!expression) {
    return undefined;
  }
  const result = Parser.evaluate(expression, values);
  return result;
};

export const getFastId = (id: string) => {
  let byDateId = id;
  if (id.includes("-")) {
    let [time, index] = id.split("-");
    const currentYear = new Date().getFullYear().toString();
    switch (time.length) {
      case 2:
        time = currentYear + "0" + time[0] + 0 + time[1];
        break;
      case 3:
        time = currentYear + "0" + time[0] + time.slice(1, 3);
        break;
      case 5:
        time = currentYear.slice(0, 3) + time[0];
        break;
      default:
        time = currentYear + time;
    }
    index = index.padStart(4, "0");
    byDateId = time + index;
  }
  return byDateId;
};
