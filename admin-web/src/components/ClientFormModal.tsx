import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IClient } from '@/types/admin';
import { useRef } from 'react';
import { postFormData } from '@/config/fetcher';

interface Props {
  clients: IClient[];
  client?: IClient;
  onClose: () => void;
  adminToken: string;
}

const schema = yup.object({
  username: yup.string().required(),
  name: yup.string().required(),
  password: yup.string().required(),
  avatar: yup.mixed().required(),
  ai_provider: yup.string().oneOf(['openai','claude','gemini']).required(),
  user_count: yup.number().required().min(1),
  meta: yup.string().notRequired(),
}).required();

type FormValues = {
  username: string;
  name: string;
  password: string;
  avatar: FileList;
  ai_provider: 'openai' | 'claude' | 'gemini';
  user_count: number;
  meta?: string;
};

export default function ClientFormModal({ clients, client, onClose, adminToken }: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      username: client?.username || '',
      name: client?.name || '',
      password: client?.password || '',
      ai_provider: client?.ai_provider || 'openai',
      user_count: client?.user_count || 1,
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

    if (fileInput.current?.files?.[0]) {
      formData.append('avatar', fileInput.current.files[0]);
    }

    // Dùng helper postFormData
    await postFormData('/admin-api/clients', formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Các input khác như cũ */}
      <input type="file" accept="image/*" {...register('avatar')} ref={fileInput} />
      {watch('avatar') && fileInput.current?.files?.[0] && (
        <img src={URL.createObjectURL(fileInput.current.files[0])} className="w-20 h-20" />
      )}
      <button type="submit">Tạo mới</button>
    </form>
  );
}
