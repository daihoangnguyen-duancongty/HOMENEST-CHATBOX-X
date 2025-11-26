import { fetcher } from '@/config/fetcher';
import type { DashboardStats, IClient, ISubscriptionPlan,IMessage,ICustomer } from '@/types/client-owner-types';

const ADMIN_PREFIX = '/api/admin';
const ADMIN_PREFIX_STATS = '/admin-api';
const CHAT_PREFIX = '/api/client/chat';
/**
 * Lấy lịch sử chat của 1 customer
 * @param clientId Id của client
 * @param customerId Id của customer
 * @returns Danh sách messages
 */

// Dashboard
export const getDashboardStats = async (): Promise<DashboardStats> =>
  fetcher(`${ADMIN_PREFIX_STATS}/dashboard`);

// Clients
export const getClients = async (): Promise<IClient[]> => {
  const data = await fetcher(`${ADMIN_PREFIX_STATS}/clients`);
  return data.clients;
};

export const getClientById = async (clientId: string): Promise<IClient> => {
  const data = await fetcher(`/clients/${clientId}`);
  return data.client;
};

export const createClient = async (
  payload: Partial<IClient>,
): Promise<IClient> => {
  const data = await fetcher(`${ADMIN_PREFIX}/create-client-user`, {
    method: 'POST',
    data: payload,
  });
  return data.client;
};

export const updateClient = async (
  clientId: string,
  payload: Partial<IClient>,
): Promise<IClient> => {
  const data = await fetcher(`${ADMIN_PREFIX_STATS}/clients/${clientId}`, {
    method: 'PUT',
    data: payload,
  });
  return data.client;
};

export const deleteClient = async (clientId: string): Promise<boolean> => {
  const data = await fetcher(`${ADMIN_PREFIX_STATS}/clients/${clientId}`, {
    method: 'DELETE',
  });
  return data.ok;
};

export const reactivateClient = async (
  clientId: string,
  extendMonths: number,
) => {
  const data = await fetcher(`${ADMIN_PREFIX_STATS}/clients/reactivate`, {
    method: 'POST',
    data: { clientId, extendMonths },
  });
  return data.client;
};
export const deactivateClient = async (clientId: string) => {
  const data = await fetcher(`${ADMIN_PREFIX_STATS}/clients/deactivate`, {
    method: 'POST',
    data: { clientId }, // server cần nhận object có clientId
  });
  return data.client;
};
export const syncClient = async (payload: any) =>
  fetcher('/clients/sync', {
    method: 'POST',
    data: payload,
  });

// Plans
export const getPlans = async (): Promise<ISubscriptionPlan[]> => {
  const data = await fetcher(`${ADMIN_PREFIX_STATS}/plans`);
  return data.plans;
};

export const createPlan = async (payload: Partial<ISubscriptionPlan>) => {
  const data = await fetcher(`${ADMIN_PREFIX_STATS}/plans`, {
    method: 'POST',
    data: payload,
  });
  return data.plan;
};

export const updatePlan = async (id: string, payload: Partial<ISubscriptionPlan>) => {
  const data = await fetcher(`${ADMIN_PREFIX_STATS}/plans/${id}`, {
    method: 'PUT',
    data: payload,
  });
  return data.plan;
};

export const deletePlan = async (id: string) => {
  const data = await fetcher(`${ADMIN_PREFIX_STATS}/plans/${id}`, {
    method: 'DELETE',
  });
  return data.ok;
};

//CHAT
export const getCustomers = async (): Promise<ICustomer[]> => {
  const data = await fetcher('/api/customer/customers');
  return data.customers;
};

export const getMessages = async (clientId: string, customerId: string): Promise<IMessage[]> => {
  const data = await fetcher(`${CHAT_PREFIX}/${clientId}/${customerId}`);
  return data.messages || [];
};

export const sendMessage = async (customerId: string, message: string) => {
  const data = await fetcher('/api/client/reply', {
    method: 'POST',
    data: { customerId, message },
  });
  return data.ok;
};

export const switchCustomerToHuman = async (customerId: string) => {
  const data = await fetcher('/api/customer/switch-human', {
    method: 'POST',
    data: { customer_id: customerId },
  });
  return data.ok;
};