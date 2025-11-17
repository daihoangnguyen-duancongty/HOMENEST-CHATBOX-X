"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { gqlClient } from "@/app/graphql/client";
import { gql } from "@apollo/client";

type LoginForm = {
  clientId: string; // bắt buộc theo backend
  username: string;
  password: string;
};

type LoginResponse = {
  loginUser: {
    token: string;
    user: {
      role: "admin" | "client";
      clientId?: string;
    };
  };
};

// Mutation phải gửi đủ clientId, username, password
const LOGIN_MUTATION = gql`
  mutation Login($clientId: String!, $username: String!, $password: String!) {
    loginUser(clientId: $clientId, username: $username, password: $password) {
      token
      user {
        role
        clientId
      }
    }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: { clientId: "client_demo_10" }, // clientId mặc định
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await gqlClient.mutate<LoginResponse>({
        mutation: LOGIN_MUTATION,
        variables: data,
      });

      const loginData = response.data?.loginUser;
      if (!loginData) throw new Error("Login failed");

      // Lưu token
      localStorage.setItem("token", loginData.token);

      // Redirect theo role
      if (loginData.user.role === "admin") router.push("/admin");
      else router.push("/client");
    } catch (err: any) {
      console.error(err);
      alert("Login failed. Check username/password.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {/* input ẩn cho clientId */}
        <input type="hidden" {...register("clientId")} />

        <input
          placeholder="Username"
          {...register("username")}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Password"
          type="password"
          {...register("password")}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
