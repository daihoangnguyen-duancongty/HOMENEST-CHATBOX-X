

export type RegisterAdminResponse = {
  ok: boolean;
  token?: string;
  error?: string;
};

export type RegisterFormInputs = {
  username: string;
  password: string;
  name: string;
  avatar?: string;
};

export type AuthState= {
  token: string | null;
  user: any | null;
  loginWithToken: (token: string) => void;
  logout: () => void;
}


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