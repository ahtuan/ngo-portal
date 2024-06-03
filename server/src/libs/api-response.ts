export class ApiResponse<T = any> {
  constructor(
    public data?: T,
    public error?: string,
    public statusCode?: number,
    public message?: string,
  ) {}

  // Static methods for common responses
  static success<T>(
    data: T,
    message?: string,
    statusCode = 200,
  ): ApiResponse<T> {
    return new ApiResponse(data, undefined, statusCode, message);
  }

  static error(error: string, statusCode = 500, message?: string): ApiResponse {
    return new ApiResponse(undefined, error, statusCode, message);
  }
}
