const saltRounds = 10;

export const hashPassword = (password: string) =>
  Bun.password.hashSync(password, {
    algorithm: "bcrypt",
    cost: saltRounds, // number between 4-31
  });

export const comparePassword = (password: string, hash: string) =>
  Bun.password.verifySync(password, hash);
