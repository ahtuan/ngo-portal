import React from "react";
import RegisterForm from "@views/auth/register/register-form";

const Index = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full md:w-1/3  mx-auto border rounded-lg p-6 lg:p-8 ">
        <h1 className="text-2xl text-center">Đăng ký</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Index;
