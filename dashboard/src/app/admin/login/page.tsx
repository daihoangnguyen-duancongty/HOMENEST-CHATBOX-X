"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { gqlClient } from "@/app/graphql/client";
import { useAuthStore } from "@/store/auth";
import { gql } from "@apollo/client";
import { useRouter } from "next/navigation";

// ---------------- Yup schema ----------------
const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

type LoginFormInputs = {
  username: string;
  password: string;
};

type LoginAdminMutation = {
  loginAdmin: {
    token: string;
    admin: {
      username: string;
      role: string;
    };
  };
};

const LOGIN_ADMIN = gql`
  mutation Login($username: String!, $password: String!) {
    loginAdmin(username: $username, password: $password) {
      token
      admin {
        username
        role
      }
    }
  }
`;

export default function AdminLoginPage() {
  const loginStore = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await gqlClient.mutate<LoginAdminMutation>({
        mutation: LOGIN_ADMIN,
        variables: data,
      });

      const token = res.data?.loginAdmin.token;
    const role = res.data?.loginAdmin.admin.role as "admin" | "client" | "employee";
if (!token || !role) throw new Error("Login failed: No token or role returned");

loginStore.login(token, role);

      router.push("/admin/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err instanceof Error ? err.message : err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <input
          {...register("username")}
          placeholder="Username"
          className={`w-full p-2 mb-2 border rounded ${
            errors.username ? "border-red-500" : ""
          }`}
        />
        {errors.username && (
          <p className="text-red-500 mb-2 text-sm">{errors.username.message}</p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className={`w-full p-2 mb-2 border rounded ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        {errors.password && (
          <p className="text-red-500 mb-2 text-sm">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
