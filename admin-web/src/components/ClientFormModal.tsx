import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IClient } from '@/types/admin';
import { postFormData } from '@/config/fetcher';
import { useRef } from 'react';

interface Props {
  clients: IClient[];
  client?: IClient;
  onClose: () => void;
}

const schema = yup.object({
  username: yup.string().required(),
  name: yup.string().required(),
  password: yup.string().required(),
  avatar: yup.mixed(),
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

export default function ClientFormModal({ clients, client, onClose }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      username: client?.username || '',
      name: client?.name || '',
      password: client?.password || '',
      ai_provider: client?.ai_provider || 'openai',
      user_count: client?.user_count || 1,
      avatar: client?.avatar || '',
      meta: client?.meta ? JSON.stringify(client.meta, null, 2) : '',
    },
    resolver: yupResolver(schema) as any,
  });

  const fileInput = useRef<HTMLInputElement>(null);

  const generateClientId = () => {
    if (!clients || clients.length === 0) return 'client_demo_1';
    const numbers = clients
      .map(c => parseInt(c.clientId.replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const max = Math.max(...numbers);
    return `client_demo_${max + 1}`;
  };

const onSubmit = async (data: FormValues) => {
  const clientId = client?.clientId || generateClientId();

  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('name', data.name);
  formData.append('password', data.password);
  formData.append('clientId', clientId);
  formData.append('user_count', String(data.user_count));
  formData.append('ai_provider', data.ai_provider);
  formData.append('meta', data.meta || '{}');

{fileInput.current?.files?.[0] && (
  <img src={URL.createObjectURL(fileInput.current.files[0])} className="w-20 h-20 rounded-lg object-cover mt-2" />
)}

  await postFormData('/admin-api/clients', formData);
  onClose();
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900/90 backdrop-blur-lg text-white rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-xl"
      >
        <h2 className="text-xl font-bold">{client ? 'Chỉnh sửa thông tin khách hàng' : 'Tạo khách hàng mới'}</h2>

        <div className="flex flex-col gap-1">
          <label>Tên người dùng HomeNest</label>
          <input {...register('username')} className="p-2 rounded bg-gray-800 text-white" />
          {errors.username && <span className="text-red-400">{errors.username.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label>Tên người dùng</label>
          <input {...register('name')} className="p-2 rounded bg-gray-800 text-white" />
          {errors.name && <span className="text-red-400">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label>Password</label>
          <input type="password" {...register('password')} className="p-2 rounded bg-gray-800 text-white" />
          {errors.password && <span className="text-red-400">{errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label>Avatar</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={() => {
              if (fileInput.current?.files?.[0]) {
                setValue('avatar', URL.createObjectURL(fileInput.current.files[0]), { shouldValidate: true });
              }
            }}
            className="p-2 rounded bg-gray-800 text-white"
          />
          {watch('avatar') && (
            <img src={watch('avatar')} alt="avatar preview" className="w-20 h-20 rounded-lg object-cover mt-2" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label>Nền tảng AI</label>
          <select {...register('ai_provider')} className="p-2 rounded bg-gray-800 text-white">
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
            <option value="gemini">Gemini</option>
          </select>
          {errors.ai_provider && <span className="text-red-400">{errors.ai_provider.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label>API key AI (JSON, optional)</label>
          <textarea {...register('meta')} className="p-2 rounded bg-gray-800 text-white h-24" />
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition">Hủy</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 transition">{client ? 'Cập nhật' : 'Tạo mới'}</button>
        </div>
      </form>
    </div>
  );
}
