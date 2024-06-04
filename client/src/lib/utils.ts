import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkActiveRoute(pathName: string, testPath: string) {
  if (pathName === "/" && testPath !== "/") {
    return false;
  }
  return new RegExp(`^${pathName}`).test(testPath);
}
