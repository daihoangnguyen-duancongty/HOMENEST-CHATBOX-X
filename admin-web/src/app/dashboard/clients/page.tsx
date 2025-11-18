// frontend/src/app/admin/clients/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gqlClient } from "@/app/graphql/client";
import { GET_CLIENTS } from "@/app/graphql/queries/getClients";
import { CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } from "@/app/graphql/mutations/createClient";
import { Client, GetClientsQuery, CreateClientMutation, UpdateClientMutation, DeleteClientMutation } from "@/types/graphql";

export default function ClientsPage() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [name, setName] = useState("");

  // ---------------- Fetch clients ----------------
  const fetchClients = async (): Promise<Client[]> => {
    const res = await gqlClient.query<GetClientsQuery>({
      query: GET_CLIENTS,
    });
    if (!res.data) throw new Error("No data returned from server");
    return res.data.clients;
  };

  const { data: clients, isLoading, isError } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  // ---------------- Mutations ----------------
  const createMutation = useMutation({
    mutationFn: async (newName: string): Promise<Client> => {
      const res = await gqlClient.mutate<CreateClientMutation>({
        mutation: CREATE_CLIENT,
        variables: { name: newName },
      });
      if (!res.data) throw new Error("Failed to create client");
      return res.data.createClient;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async (client: Client): Promise<Client> => {
      const res = await gqlClient.mutate<UpdateClientMutation>({
        mutation: UPDATE_CLIENT,
        variables: client,
      });
      if (!res.data) throw new Error("Failed to update client");
      return res.data.updateClient;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (clientId: string): Promise<{ clientId: string }> => {
      const res = await gqlClient.mutate<DeleteClientMutation>({
        mutation: DELETE_CLIENT,
        variables: { clientId },
      });
      if (!res.data) throw new Error("Failed to delete client");
      return res.data.deleteClient;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });

  // ---------------- Handlers ----------------
  const openModal = (client?: Client) => {
    setEditClient(client || null);
    setName(client?.name || "");
    setModalOpen(true);
  };

  const onSubmit = () => {
    if (editClient) {
      updateMutation.mutate({ ...editClient, name });
    } else {
      createMutation.mutate(name);
    }
    setModalOpen(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading clients</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Clients</h1>
      <button
        onClick={() => openModal()}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
      >
        Add Client
      </button>

      <div className="mt-4 space-y-3">
        {clients?.map((c) => (
          <div
            key={c.clientId}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <p><strong>Name:</strong> {c.name}</p>
              <p><strong>User Count:</strong> {c.user_count}</p>
              <p><strong>Status:</strong> {c.active ? "Active" : "Inactive"}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => openModal(c)}
                className="bg-yellow-500 px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(c.clientId)}
                className="bg-red-500 px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Modal ---------------- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-bold mb-2">
              {editClient ? "Edit Client" : "Add Client"}
            </h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client Name"
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="bg-blue-600 px-4 py-2 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
