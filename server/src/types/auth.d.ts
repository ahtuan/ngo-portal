declare namespace Auth {
  type SignInResponse = {
    token: string;
  };

  type SignUpBody = {
    fullName: string;
    username: string;
    password: string;
  };
  type SignUpResponse = {
    fullName: string;
    username: string;
    isActive: boolean;
    uuid: string;
  };
}
