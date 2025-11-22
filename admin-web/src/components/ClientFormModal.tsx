import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IClient } from '@/types/admin';
import { uploadToCloudinary } from "@/config/cloudinary";

interface Props {
  clients: IClient[]; // danh sách khách hàng hiện có
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
  meta: yup.string().notRequired(), // JSON string, optional
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
  let parsedMeta: Record<string, any> | undefined;

  if (data.meta && data.meta.trim() !== "") {
    const metaStr = data.meta.trim();

    // 1) Nếu người dùng nhập JSON → parse bình thường
    if (metaStr.startsWith("{")) {
      try {
        parsedMeta = JSON.parse(metaStr);
      } catch (e) {
        alert("Meta phải là JSON hợp lệ!");
        return;
      }
    } 
    // 2) Nếu người dùng chỉ nhập API key → tự convert JSON
    else {
      parsedMeta = { openai: metaStr };
    }
  }

  const newClientId = client?.clientId || generateClientId();

const payload: Partial<IClient> = {
  clientId: newClientId,
  ...data,
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
        <h2 className="text-xl font-bold">{client ? 'Chỉnh sửa thông tin khách hàng' : 'Tạo khách hàng mới'}</h2>

        {/* <div className="flex flex-col gap-1">
          <label>Client ID</label>
          <input
            value={client?.clientId || generateClientId()}
            disabled
            className="p-2 rounded bg-gray-800 text-white"
          />
        </div> */}

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

        {/* Upload Avatar + Preview */}
<div className="flex flex-col gap-2">
  <label>Avatar</label>

  {/* Input chọn file */}
  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Upload lên Cloudinary
      const url = await uploadToCloudinary(file);

      // Gán vào field 'avatar'
      setValue("avatar", url, { shouldValidate: true });
    }}
    className="p-2 rounded bg-gray-800 text-white"
  />

  {/* Preview ảnh (bằng avatar từ react-hook-form) */}
  {watch("avatar") && (
    <img
      src={watch("avatar")}
      alt="avatar preview"
      className="w-20 h-20 rounded-lg object-cover mt-2"
    />
  )}

  {errors.avatar && (
    <span className="text-red-400">{errors.avatar.message}</span>
  )}

  {/* Input text để xem/đổi URL nếu muốn */}
  <input
    {...register("avatar")}
    className="p-2 rounded bg-gray-800 text-white"
    placeholder="Hoặc dán URL ảnh"
  />
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

        {/* <div className="flex flex-col gap-1">
          <label>User Count</label>
          <input type="number" {...register('user_count')} className="p-2 rounded bg-gray-800 text-white" />
          {errors.user_count && <span className="text-red-400">{errors.user_count.message}</span>}
        </div> */}

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
