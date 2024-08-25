import http from "@/lib/http";

export const reportEndpoint = "/api/report";
export const reportRequest = {
  // TODO Optimise caching
  get: async <T>(url: string) => {
    if (!url.startsWith("/api/report")) {
      url = `${reportEndpoint}/${url}`;
    }
    const response = await http.get<T>(url, {
      cache: "no-cache",
    });
    return response.data;
  },
};
