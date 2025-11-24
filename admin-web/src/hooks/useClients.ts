import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as clientApi from '@/api/admin';
import { IClient } from '@/types/admin';

export const useClients = () => {
  const queryClient = useQueryClient();

  const query = useQuery<IClient[], Error>({
    queryKey: ['clients'],
    queryFn: clientApi.getClients,
    // staleTime: 1000 * 60,
  });

  const create = useMutation<IClient, Error, Partial<IClient>>({
    mutationFn: (payload) => clientApi.createClient(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });

  const update = useMutation<
    IClient,
    Error,
    { id: string; payload: Partial<IClient> }
  >({
    mutationFn: ({ id, payload }) => clientApi.updateClient(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });

  const remove = useMutation<boolean, Error, string>({
    mutationFn: (id) => clientApi.deleteClient(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });

  const reactivate = useMutation<
    IClient,
    Error,
    { clientId: string; extendMonths: number }
  >({
    mutationFn: ({ clientId, extendMonths }) =>
      clientApi.reactivateClient(clientId, extendMonths),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });
  const deactivate = useMutation<IClient, Error, string>({
    mutationFn: (clientId) => clientApi.deactivateClient(clientId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });

  return { query, create, update, remove, reactivate, deactivate };
};
