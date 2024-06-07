type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

type BaseResponse<T> = {
  data?: T;
  message?: string;
  statusCode: number;
  error?: unknown;
};

let clientLogoutRequest: null | Promise<any> = null;
export const isClient = () => typeof window !== "undefined";
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined,
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: {
    [key: string]: string;
  } =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient()) {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      baseHeaders.Authorization = `Bearer ${sessionToken}`;
    }
  }

  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ
  // envConfig.NEXT_PUBLIC_API_ENDPOINT Nếu truyền baseUrl thì lấy giá trị
  // truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến
  // Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });
  const result: BaseResponse<Response> = await res.json();

  // Interceptor là nời chúng ta xử lý request và response trước khi trả về cho
  // phía component

  //TODO Interceptor handler for response

  // if (!res.ok) {
  //   if (res.status === ENTITY_ERROR_STATUS) {
  //     throw new EntityError(
  //       data as {
  //         status: 422;
  //         payload: EntityErrorPayload;
  //       },
  //     );
  //   } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
  //     if (isClient()) {
  //       if (!clientLogoutRequest) {
  //         clientLogoutRequest = fetch("/api/auth/logout", {
  //           method: "POST",
  //           body: JSON.stringify({ force: true }),
  //           headers: {
  //             ...baseHeaders,
  //           } as any,
  //         });
  //         try {
  //           await clientLogoutRequest;
  //         } catch (error) {
  //         } finally {
  //           localStorage.removeItem("sessionToken");
  //           localStorage.removeItem("sessionTokenExpiresAt");
  //           clientLogoutRequest = null;
  //           location.href = "/login";
  //         }
  //       }
  //     } else {
  //       const sessionToken = (options?.headers as any)?.Authorization.split(
  //         "Bearer ",
  //       )[1];
  //       redirect(`/logout?sessionToken=${sessionToken}`);
  //     }
  //   } else {
  //     throw new HttpError(data);
  //   }
  // }
  // // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  // if (isClient()) {
  //   if (
  //     ["auth/login", "auth/register"].some(
  //       (item) => item === normalizePath(url),
  //     )
  //   ) {
  //     const { token, expiresAt } = (payload as LoginResType).data;
  //     localStorage.setItem("sessionToken", token);
  //     localStorage.setItem("sessionTokenExpiresAt", expiresAt);
  //   } else if ("auth/logout" === normalizePath(url)) {
  //     localStorage.removeItem("sessionToken");
  //     localStorage.removeItem("sessionTokenExpiresAt");
  //   }
  // }
  return result;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
