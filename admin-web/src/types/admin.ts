export type AdminAuthData = {
  username: string;
  password: string;
  name?: string;
  avatar?: string;
};
export type LoginFormInputs = {
  username: string;
  password: string;
};
export type DashboardStats = {
  totalClients: number;
  activeClients: number;
  trialClients: number;
  totalUsers: number;
};