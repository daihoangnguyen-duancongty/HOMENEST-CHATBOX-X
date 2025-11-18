// src/types/graphql.ts

// Client

export type Client = {
  clientId: string;
  name: string;
  user_count: number;
  active: boolean;
};

export type GetClientsQuery = {
  clients: Client[];
};

export type CreateClientMutation = {
  createClient: Client;
};

export type UpdateClientMutation = {
  updateClient: Client;
};

export type DeleteClientMutation = {
  deleteClient: { clientId: string };
};

// Employee

export type Employee = {
  userId: string;
  username: string;
  name: string;
  role: string;
  avatar?: string;
};

export type GetEmployeesQuery = {
  employees: Employee[];
};
