import { ApiResponse } from "@/libs/api-response";

// Lỗi xác thực dữ liệu
export class EntityError extends ApiResponse {
  constructor(error: string, message?: string) {
    super(undefined, error, 422, message);
  }
}

export class NotFoundError extends ApiResponse {
  constructor(message?: string) {
    super(undefined, "Not Found", 404, message);
  }
}

export class UnauthorizedError extends ApiResponse {
  constructor(message?: string) {
    super(undefined, "Unauthorized", 401, message);
  }
}
