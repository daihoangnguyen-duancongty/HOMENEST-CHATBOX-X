// frontend/src/app/client/employees/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gqlClient } from "@/app/graphql/client";
import { GET_EMPLOYEES } from "@/app/graphql/queries/getEmployees";
import { CREATE_EMPLOYEE, DELETE_EMPLOYEE, REACTIVATE_CLIENT } from "@/app/graphql/mutations/createEmployee";
import { useAuthStore } from "@/store/auth";
import { Employee,GetEmployeesQuery } from "@/types/graphql";

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const clientId = token ? JSON.parse(atob(token.split(".")[1])).clientId : "";

  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

const { data, isLoading, error } = useQuery<Employee[]>({
  queryKey: ["employees", clientId],
  queryFn: async (): Promise<Employee[]> => {
    const res = await gqlClient.query<GetEmployeesQuery>({
      query: GET_EMPLOYEES,
      variables: { clientId },
    });

    if (!res.data) throw new Error("No employees returned");
    return res.data.employees; // TypeScript biết đây là Employee[]
  },
});



const createMutation = useMutation({
  mutationFn: async (emp: { username: string; name: string; avatar?: string }) => {
    const res = await gqlClient.mutate({
      mutation: CREATE_EMPLOYEE,
      variables: { clientId, ...emp },
    });
    if (!res.data) throw new Error("Failed to create employee");
    return res.data;
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees", clientId] }),
});

const deleteMutation = useMutation({
  mutationFn: async (userId: string) => {
    const res = await gqlClient.mutate({
      mutation: DELETE_EMPLOYEE,
      variables: { userId },
    });
    if (!res.data) throw new Error("Failed to delete employee");
    return res.data;
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees", clientId] }),
});

const reactivateMutation = useMutation({
  mutationFn: async (extendMonths: number) => {
    const res = await gqlClient.mutate({
      mutation: REACTIVATE_CLIENT,
      variables: { clientId, extendMonths },
    });
    if (!res.data) throw new Error("Failed to reactivate client");
    return res.data;
  },
  onSuccess: () => alert("Client reactivated!"),
});


  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading employees</p>;

  const openModal = () => {
    setUsername("");
    setName("");
    setAvatar("");
    setModalOpen(true);
  };

  const onSubmit = () => {
    createMutation.mutate({ username, name, avatar });
    setModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Employees</h1>
      <button onClick={openModal} className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Add Employee</button>
      <button
        onClick={() => reactivateMutation.mutate(2)}
        className="bg-green-600 text-white px-4 py-2 rounded ml-2"
      >
        Reactivate Client + Extend 2 months
      </button>

      <div className="mt-4 space-y-3">
   {data?.map((e) => (
  <div key={e.userId} className="p-4 bg-white rounded shadow flex justify-between items-center">
    <div>
      <p>{e.name}</p>
      <p>Username: {e.username}</p>
      <p>Role: {e.role}</p>
    </div>
    <div className="space-x-2">
      <button onClick={() => deleteMutation.mutate(e.userId)} className="bg-red-500 px-2 py-1 rounded">
        Delete
      </button>
    </div>
  </div>
))}

      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-bold mb-2">Add Employee</h2>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="border p-2 w-full mb-2"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="border p-2 w-full mb-2"
            />
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Avatar URL"
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setModalOpen(false)} className="bg-gray-500 px-4 py-2 rounded">Cancel</button>
              <button onClick={onSubmit} className="bg-blue-600 px-4 py-2 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
