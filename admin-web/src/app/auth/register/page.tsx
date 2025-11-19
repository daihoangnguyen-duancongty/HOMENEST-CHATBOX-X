"use client";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerAdmin } from "./../../../api/auth";
import { useRouter } from "next/navigation";
import {RegisterFormInputs} from '@/types/admin'


const registerSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  name: Yup.string().required("Name is required"),
});

export default function RegisterPage() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerSchema),
  });

 const onSubmit = async (data: RegisterFormInputs): Promise<void> => {
  try {
    const res = await registerAdmin(data);
    if (res.ok) router.push("/admin/dashboard");
    else alert(res.error || "Register failed");
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : "Register error");
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Register</h2>

        <input {...register("username")} placeholder="Username" className={`w-full p-2 mb-2 border rounded ${errors.username ? "border-red-500" : ""}`} />
        {errors.username && <p className="text-red-500 mb-2 text-sm">{errors.username.message}</p>}

        <input {...register("password")} type="password" placeholder="Password" className={`w-full p-2 mb-2 border rounded ${errors.password ? "border-red-500" : ""}`} />
        {errors.password && <p className="text-red-500 mb-2 text-sm">{errors.password.message}</p>}

        <input {...register("name")} placeholder="Full Name" className={`w-full p-2 mb-2 border rounded ${errors.name ? "border-red-500" : ""}`} />
        {errors.name && <p className="text-red-500 mb-2 text-sm">{errors.name.message}</p>}

        <input {...register("avatar")} placeholder="Avatar URL" className="w-full p-2 mb-2 border rounded" />

        <button type="submit" className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Register
        </button>
      </form>
    </div>
  );
}
