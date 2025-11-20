

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
export type IClient = {
  clientId: string;
  avatar?:string;
  name: string;
  active: boolean;
  trial: boolean;
  trial_end: string | null; // ISO string
  user_count: number;
  subscription_plan?: IPlan;
  ai_provider?: 'openai' | 'claude' | 'gemini';
  api_keys?: Record<string, string>;
  meta?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
    username?: string; 
  password?: string; 
};

export type IPlan = {
  _id: string;
  name: string;
  price: number;
  max_users: number;
  features: string[];
  created_at?: string;
  updated_at?: string;
};
