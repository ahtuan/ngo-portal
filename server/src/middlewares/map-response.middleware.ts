import { Context } from "elysia";
const encoder = new TextEncoder();

export const mapResponseMiddleware = (context: Context) => {
  // @ts-ignore
  const { response, set } = context;
  const isJson = typeof response === "object";
  const text = isJson ? JSON.stringify(response) : response?.toString() ?? "";
  set.headers["Content-Encoding"] = "gzip";

  return new Response(Bun.gzipSync(encoder.encode(text)), {
    ...context,
    headers: {
      "Content-Type": `${
        isJson ? "application/json" : "text/plain"
      }; charset=utf-8`,
    },
    status: response.statusCode,
  });
};
