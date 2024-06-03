import Elysia, { t } from "elysia";

export const authModel = new Elysia({
  name: "Model.Auth",
}).model({
  "auth.sign-in": t.Object({
    username: t.String({
      required: true,
      minLength: 5,
      message: "Tên đăng nhập phải có ít nhất 5 kí tự",
    }),
    password: t.String({
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$',
      minLength: 8,
    }),
  }),
  "auth.sign-up": t.Object({
    username: t.String({
      required: true,
      minLength: 5,
      message: "Tên đăng nhập phải có ít nhất 5 kí tự",
    }),
    password: t.String({
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$',
      minLength: 8,
    }),
    fullName: t.String(),
  }),
});
