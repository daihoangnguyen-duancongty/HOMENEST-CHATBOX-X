import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IClient, ISubscriptionPlan } from '@/types/admin';
import { postFormData } from '@/config/fetcher';
import { useRef } from 'react';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  clients: IClient[];
  client?: IClient;
  plans: ISubscriptionPlan[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  onSuccess?: (message: string) => void;
}

const schema = yup
  .object({
    username: yup.string().required(),
    name: yup.string().required(),
    password: yup.string().required(),
    avatar: yup.mixed(),
    ai_provider: yup.string().oneOf(['openai', 'claude', 'gemini']).required(),
    user_count: yup.number().required().min(1),
    meta: yup.string().notRequired(),
  })
  .required();

type FormValues = {
  username: string;
  name: string;
  password: string;
  avatar: string;
  ai_provider: 'openai' | 'claude' | 'gemini';
  user_count: number;
  meta?: string;
  subscription_plan: string;
  active?: boolean;
};

export default function ClientFormModal({
  clients,
  client,
  plans,
  onClose,
  onSuccess,
}: Props) {
  // React Query client
  const queryClient = useQueryClient();
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: client?.username || '',
      name: client?.name || '',
      password: client?.password || '',
      ai_provider: client?.ai_provider || 'openai',
      user_count: client?.user_count || 1,
      avatar: client?.avatar || '',
      meta: client?.meta ? JSON.stringify(client.meta, null, 2) : '',
      subscription_plan:
        client?.subscription_plan?._id || plans?.[0]?._id || '',
      active: client?.active ?? true,
    },

    resolver: yupResolver(schema) as any,
  });

  const fileInput = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('name', data.name);
      formData.append('password', data.password);
      formData.append('user_count', String(data.user_count));
      formData.append('ai_provider', data.ai_provider);
      formData.append('subscription_plan', data.subscription_plan);
      formData.append('meta', data.meta || '{}');

      if (fileInput.current?.files?.[0]) {
        formData.append('avatar', fileInput.current.files[0]);
      }

      let message = '';
      if (client) {
        // Update client hiện có
        await postFormData(
          `/admin-api/clients/${client.clientId}`,
          formData,
          'PUT',
        );
        message = 'Cập nhật khách hàng thành công!';
      } else {
        // Tạo client mới - không cần clientId từ frontend
        await postFormData('/admin-api/clients', formData, 'POST');
        message = 'Tạo khách hàng thành công!';
      }

      // Reload clients
      queryClient.invalidateQueries({ queryKey: ['clients'] });

      // Show success
      onSuccess?.(message);

      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-gray-900/90 backdrop-blur-lg text-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col gap-4 shadow-xl'
      >
        <h2 className='text-xl font-bold'>
          {client ? 'Chỉnh sửa thông tin khách hàng' : 'Tạo khách hàng mới'}
        </h2>

        <div className='flex flex-col gap-1'>
          <label>Tên người dùng HomeNest</label>
          <input
            {...register('username')}
            className='p-2 rounded bg-gray-800 text-white'
          />
          {errors.username && (
            <span className='text-red-400'>{errors.username.message}</span>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <label>Tên người dùng</label>
          <input
            {...register('name')}
            className='p-2 rounded bg-gray-800 text-white'
          />
          {errors.name && (
            <span className='text-red-400'>{errors.name.message}</span>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <label>Password</label>
          <input
            type='password'
            {...register('password')}
            className='p-2 rounded bg-gray-800 text-white'
          />
          {errors.password && (
            <span className='text-red-400'>{errors.password.message}</span>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <label>Avatar</label>
          {(watch('avatar') || client?.avatar) && (
            <div className='relative w-20 h-20 mt-2'>
              <Image
                src={watch('avatar') || client?.avatar || '/default-avatar.png'}
                alt='avatar preview'
                className='rounded-lg object-cover'
                fill
                sizes='80px'
              />
            </div>
          )}
          <input
            type='file'
            accept='image/*'
            ref={fileInput}
            onChange={() => {
              if (fileInput.current?.files?.[0]) {
                setValue(
                  'avatar',
                  URL.createObjectURL(fileInput.current.files[0]),
                  { shouldValidate: true },
                );
              }
            }}
            className='p-2 rounded bg-blue-300 text-white w-[5.3vw]'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label>Nền tảng AI</label>
          <select
            {...register('ai_provider')}
            className='p-2 rounded bg-gray-800 text-white'
          >
            <option value='openai'>OpenAI</option>
            <option value='claude'>Claude</option>
            <option value='gemini'>Gemini</option>
          </select>
          {errors.ai_provider && (
            <span className='text-red-400'>{errors.ai_provider.message}</span>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <label>Gói sản phẩm</label>
          <select
            {...register('subscription_plan')}
            className='p-2 rounded bg-gray-800 text-white'
          >
            {plans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name} - {plan.max_users} users / {plan.max_files} files -{' '}
                {plan.price} VNĐ
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-2 mt-2'>
          <input
            type='checkbox'
            {...register('active')}
            className='accent-indigo-500'
          />
          <span>Đang hoạt động</span>
        </div>
        <div className='flex flex-col gap-1'>
          <label>API key AI</label>
          <textarea
            {...register('meta')}
            className='p-2 rounded bg-gray-800 text-white h-24'
          />
        </div>

        <div className='flex justify-end gap-2 mt-2'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition'
          >
            Hủy
          </button>
          <button
            type='submit'
            className='px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-700 text-white font-semibold w-full md:w-auto hover:from-blue-600 hover:via-indigo-600 hover:to-indigo-800 transition-transform transform hover:scale-105'
          >
            {client ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </form>
    </div>
  );
}
