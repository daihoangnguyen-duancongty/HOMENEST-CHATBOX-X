"use client";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IClient } from '@/types/admin';
import { uploadToCloudinary } from "@/config/cloudinary";

interface Props {
  clients: IClient[];
  client?: IClient;
  onSubmit: (data: Partial<IClient>) => void;
  onClose: () => void;
}

const schema = yup.object({
  username: yup.string().required(),
  name: yup.string().required(),
  password: yup.string().required(),
  avatar: yup.string().url().required(),
  ai_provider: yup.string().oneOf(['openai','claude','gemini']).required(),
  user_count: yup.number().required().min(1),
  meta: yup.string().notRequired(),
}).required();

type FormValues = {
  username: string;
  name: string;
  password: string;
  avatar: string;
  ai_provider: 'openai' | 'claude' | 'gemini';
  user_count: number;
  meta?: string;
};

export default function ClientFormModal({ clients, client, onSubmit, onClose }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      username: client?.username || '',
      name: client?.name || '',
      password: client?.password || '',
      avatar: client?.avatar || '',
      ai_provider: client?.ai_provider || 'openai',
      user_count: client?.user_count || 1,
      meta: client?.meta ? JSON.stringify(client.meta, null, 2) : '',
    },
    resolver: yupResolver(schema) as unknown as any,
  });

  const generateClientId = () => {
    if (!clients || clients.length === 0) return 'client_demo_1';
    const numbers = clients
      .map(c => parseInt(c.clientId.replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const max = Math.max(...numbers);
    return `client_demo_${max + 1}`;
  };

  const handleFormSubmit = (data: FormValues) => {
    const avatarUrl = typeof data.avatar === "string" ? data.avatar : "";
    const parsedMeta = data.meta?.trim()
      ? data.meta.trim().startsWith("{")
        ? JSON.parse(data.meta)
        : { openai: data.meta.trim() }
      : undefined;

    const payload: Partial<IClient> = {
      clientId: client?.clientId || generateClientId(),
      ...data,
      avatar: avatarUrl,
      meta: parsedMeta,
      api_keys: parsedMeta ? { openai: parsedMeta.openai } : {},
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <form
        onSubmit={handleSubmit(handleFormSubmit as any)}
        className="bg-gray-900/90 backdrop-blur-lg text-white rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-xl"
      >
        <h2 className="text-xl font-bold">{client ? 'Chỉnh sửa khách hàng' : 'Tạo khách hàng mới'}</h2>

        {/* Username */}
        <input {...register('username')} placeholder="Username" className="p-2 rounded bg-gray-800 text-white"/>
        {errors.username && <span className="text-red-400">{errors.username.message}</span>}

        {/* Name */}
        <input {...register('name')} placeholder="Tên khách hàng" className="p-2 rounded bg-gray-800 text-white"/>
        {errors.name && <span className="text-red-400">{errors.name.message}</span>}

        {/* Password */}
        <input type="password" {...register('password')} placeholder="Password" className="p-2 rounded bg-gray-800 text-white"/>
        {errors.password && <span className="text-red-400">{errors.password.message}</span>}

        {/* Avatar Upload + Preview */}
        <div className="flex flex-col gap-2">
          <label>Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadToCloudinary(file);
              setValue("avatar", url, { shouldValidate: true });
            }}
            className="p-2 rounded bg-gray-800 text-white"
          />
          {watch("avatar") && (
            <img src={watch("avatar")} alt="avatar preview" className="w-20 h-20 rounded-lg object-cover mt-2" />
          )}
          <input {...register("avatar")} placeholder="Hoặc dán URL" className="p-2 rounded bg-gray-800 text-white"/>
          {errors.avatar && <span className="text-red-400">{errors.avatar.message}</span>}
        </div>

        {/* AI Provider */}
        <select {...register('ai_provider')} className="p-2 rounded bg-gray-800 text-white">
          <option value="openai">OpenAI</option>
          <option value="claude">Claude</option>
          <option value="gemini">Gemini</option>
        </select>

        <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 transition">{client ? 'Cập nhật' : 'Tạo mới'}</button>
      </form>
    </div>
  );
}
