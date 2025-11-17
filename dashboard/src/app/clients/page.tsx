'use client';

import { useQuery } from '@apollo/client';
import { gqlClient } from '@/app/graphql/client';
import { GET_CLIENTS } from '@/app/graphql/queries/getClients';

export default function ClientsPage() {
  // sử dụng Apollo Client
  const { data, loading, error } = useQuery(GET_CLIENTS, { client: gqlClient });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error); // lỗi sẽ được Sentry tự log nếu setup
    return <p>Error loading clients</p>;
  }

  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold'>All Clients</h1>

      <div className='mt-4 space-y-3'>
        {data.clients.map((c: any) => (
          <div key={c.clientId} className='p-4 bg-white rounded shadow'>
            <p>{c.name}</p>
            <p>User Count: {c.user_count}</p>
            <p>Status: {c.active ? 'Active' : 'Inactive'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
