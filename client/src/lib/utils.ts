import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PATH } from "@/constants/path";

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

  const part = parts[0] || "dashboard";
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
) => {
  if (!input) {
    return "";
  }
  let formattedValue = input.toString().replace(/[^0-9.-]+/g, "");
  formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (formattedValue.includes(".")) {
    const [dollars, cents] = formattedValue.split(".");
    formattedValue = `${dollars}.${cents.slice(0, 2)}`;
  }
  return formattedValue;
};

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
