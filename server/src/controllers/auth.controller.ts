import Elysia from "elysia";
import { authModel } from "@/models/auth.model";
import db from "@/db";
import AuthService from "@/services/auth.service";

export const authController = new Elysia({
  prefix: "auth",
  name: "Controller.Auth",
})
  .decorate({
    service: new AuthService(),
  })
  .use(authModel)
  .post(
    "/sign-in",
    async ({ body, service }) => {
      return await service.signIn(body);
    },
    {
      body: "auth.sign-in",
    },
  )
  .post("/sign-up", async ({ body, service }) => await service.signUp(body), {
    body: "auth.sign-up",
  });
