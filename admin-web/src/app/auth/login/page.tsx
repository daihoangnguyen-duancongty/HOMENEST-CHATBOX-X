"use client";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginAdmin } from "./../../../api/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./../../../store/auth";
import type { LoginFormInputs } from "./../../../types/admin";



const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

const onSubmit = async (data: LoginFormInputs) => {
  try {
    const res = await loginAdmin(data);
    if (!res.ok) return alert(res.error || "Login failed");

    const user = useAuthStore.getState().user;

    if (!user) return alert("Invalid token");

    if (user.role === "admin") router.push("/dashboard ");
    else return;

  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : "Login error");
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        <input {...register("username")} placeholder="Username" className={`w-full p-2 mb-2 border rounded ${errors.username ? "border-red-500" : ""}`} />
        {errors.username && <p className="text-red-500 mb-2 text-sm">{errors.username.message}</p>}

        <input {...register("password")} type="password" placeholder="Password" className={`w-full p-2 mb-2 border rounded ${errors.password ? "border-red-500" : ""}`} />
        {errors.password && <p className="text-red-500 mb-2 text-sm">{errors.password.message}</p>}

        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  );
}
