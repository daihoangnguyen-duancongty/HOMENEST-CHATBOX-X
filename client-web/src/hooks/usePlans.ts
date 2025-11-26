import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '@/api/client-owner';
import { ISubscriptionPlan } from '@/types/client-owner-types';

export const usePlans = () => {
  const queryClient = useQueryClient();

  // Lấy danh sách plan
  const query = useQuery<ISubscriptionPlan[], Error>({
    queryKey: ['plans'],
    queryFn: adminApi.getPlans,
    staleTime: 1000 * 60, // 1 phút
  });

  // Tạo plan mới
  const create = useMutation<
    ISubscriptionPlan,
    Error,
    Partial<ISubscriptionPlan>
  >({
    mutationFn: (payload) => adminApi.createPlan(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] }),
  });

  // Cập nhật plan
  const update = useMutation<
    ISubscriptionPlan,
    Error,
    { id: string; payload: Partial<ISubscriptionPlan> }
  >({
    mutationFn: ({ id, payload }) => adminApi.updatePlan(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] }),
  });

  // Xóa plan
  const remove = useMutation<boolean, Error, string>({
    mutationFn: (id) => adminApi.deletePlan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] }),
  });

  return { query, create, update, remove };
};
