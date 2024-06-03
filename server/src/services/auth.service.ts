import { ApiResponse } from "@/libs/api-response";
import db from "@/db";

class AuthService {
  async signIn(body: {
    username: string;
    password: string;
  }): Promise<ApiResponse<AUTH.SignInResponse>> {
    const data = await db.query.accounts.findFirst();
    console.log("data retrived", data);
    return ApiResponse.success<AUTH.SignInResponse>({
      token: data?.username || "a",
    });
  }
}

export default AuthService;
