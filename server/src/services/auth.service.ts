import { ApiResponse } from "@/libs/api-response";
import db from "@/db";
import { comparePassword, hashPassword } from "@/libs/crypto";
import { EntityError } from "@/libs/error";
import { accounts } from "@/db/schemas/auth.schema";

class AuthService {
  async signIn(body: {
    username: string;
    password: string;
  }): Promise<ApiResponse<Auth.SignInResponse>> {
    // Find account in database
    const account = await db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.username, body.username),
    });
    if (!account) {
      return new EntityError("Tên đăng nhập không tồn tại");
    }

    // Compare hash password
    const isPasswordMatched = comparePassword(body.password, account.password);
    if (!isPasswordMatched) {
      return new EntityError("Tên đăng nhập hoặc mật khẩu không đúng");
    }

    if (!account.isActive) {
      return new EntityError("Tài khoản không được kích hoạt");
    }

    //TODO Upsert jwt token and response
    return ApiResponse.success<Auth.SignInResponse>({
      token: "",
    });
  }

  async signUp(
    body: Auth.SignUpBody,
  ): Promise<ApiResponse<Auth.SignUpResponse>> {
    try {
      const response = await db
        .insert(accounts)
        .values({
          ...body,
          password: hashPassword(body.password),
          isActive: true,
        })
        .returning({
          uuid: accounts.uuid,
          fullName: accounts.fullName,
          username: accounts.username,
          isActive: accounts.isActive,
        });

      return ApiResponse.success<Auth.SignUpResponse>(
        response[0] as Auth.SignUpResponse,
      );
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponse.error(error.message);
      } else {
        console.error("An unknown error occurred.", error);
        return ApiResponse.error("An unknown error occurred.", 500);
      }
    }
  }
}

export default AuthService;
