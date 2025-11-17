"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { gqlClient } from "@/app/graphql/client";
import { useMutation } from "@tanstack/react-query";
import { gql } from "@apollo/client";

type LoginForm = {
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

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
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
  const { register, handleSubmit } = useForm<LoginForm>();

  const loginMutation = useMutation<
    { token: string; user: { role: "admin" | "client"; clientId?: string } },
    Error,
    LoginForm
  >({
    mutationFn: async (data: LoginForm) => {
      const { data: res } = await gqlClient.mutate<LoginResponse>({
        mutation: LOGIN_MUTATION,
        variables: data,
      });

      if (!res?.loginUser) throw new Error("Login failed");
      return res.loginUser;
    },
    onSuccess: (res) => {
      localStorage.setItem("token", res.token);
      if (res.user.role === "admin") router.push("/admin");
      else router.push("/client");
    },
    onError: (err) => {
      console.error(err);
      alert("Login failed. Check username/password.");
    },
  });

  const onSubmit = (data: LoginForm) => loginMutation.mutate(data);

  // --- React Query v5 trạng thái ---
  const isLoading = loginMutation.status === "pending";
  const isError = loginMutation.status === "error";
  const error = loginMutation.error;

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

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
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {isError && (
          <p className="text-red-500 text-sm text-center mt-2">
            {error?.message}
          </p>
        )}
      </form>
    </div>
  );
}
