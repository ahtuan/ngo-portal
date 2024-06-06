"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/xpx6c4v8Igv
 * Documentation:
 *   https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { PATH } from "@/constants/path";

export default function Component() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-md space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Oops! <br />
          Đã xảy ra lỗi
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Có lỗi xảy ra trong quá trình tải dữ liệu. Hãy thử lại sau hoặc liên
          hệ Administrator
        </p>
        <Link
          href={PATH.dashboard.path}
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          prefetch={false}
        >
          Về Trang Chủ
        </Link>
      </div>
    </div>
  );
}
