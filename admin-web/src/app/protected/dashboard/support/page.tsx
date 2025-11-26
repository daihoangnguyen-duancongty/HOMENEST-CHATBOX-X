'use client';

import { useEffect, useState } from 'react';
import { getSupportTickets } from '@/api/admin';
import Link from 'next/link';

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSupportTickets();
        setTickets(data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📩 Danh sách yêu cầu hỗ trợ</h1>

      <table className="w-full border bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Ticket ID</th>
            <th className="p-2 border">Client ID</th>
            <th className="p-2 border">Nội dung</th>
            <th className="p-2 border">Thời gian</th>
            <th className="p-2 border">Xem</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr key={t._id} className="border-b">
              <td className="p-2 border">{t.ticketId}</td>
              <td className="p-2 border">{t.clientId}</td>
              <td className="p-2 border max-w-[280px] truncate">{t.message}</td>
              <td className="p-2 border">
                {new Date(t.created_at).toLocaleString('vi-VN')}
              </td>
              <td className="p-2 border text-center">
                <Link
                  href={`/protected/dashboard/support/${t.ticketId}`}
                  className="text-blue-600 underline"
                >
                  Xem
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tickets.length === 0 && (
        <p className="mt-4 text-gray-500">Không có yêu cầu hỗ trợ nào.</p>
      )}
    </div>
  );
}
