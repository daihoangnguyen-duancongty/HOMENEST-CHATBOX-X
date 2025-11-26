'use client';

import { useEffect, useState } from 'react';
import { fetcher } from '@/config/fetcher';
import { replySupportTicket } from '@/api/admin';

export default function TicketDetail({ params }: any) {
  const { ticketId } = params;
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetcher(`/admin-api/support-tickets`);
        const found = data.tickets.find((x: any) => x.ticketId === ticketId);
        setTicket(found);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    load();
  }, [ticketId]);

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    setSending(true);
    try {
      const updated = await replySupportTicket(ticketId, replyMessage.trim());
      setTicket(updated);
      setReplyMessage('');
    } catch (err) {
      console.log(err);
    }
    setSending(false);
  };

  if (loading) return <p className="p-6">Đang tải...</p>;
  if (!ticket) return <p className="p-6">Ticket không tồn tại</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">🎫 Chi tiết yêu cầu hỗ trợ</h1>

      <div className="bg-white shadow p-4 rounded border mb-6">
        <p><b>Ticket ID:</b> {ticket.ticketId}</p>
        <p><b>Client ID:</b> {ticket.clientId}</p>
        <p><b>Thời gian:</b> {new Date(ticket.created_at).toLocaleString('vi-VN')}</p>
        <div className="mt-4">
          <b>Nội dung:</b>
          <p className="p-2 bg-gray-100 rounded mt-2">{ticket.message}</p>
        </div>
      </div>

      <div className="bg-white shadow p-4 rounded border mb-6">
        <h2 className="text-xl font-semibold mb-2">💬 Phản hồi</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {ticket.responses?.map((r: any, idx: number) => (
            <div
              key={idx}
              className={`p-2 rounded ${r.admin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              <p>{r.message}</p>
              <small className="text-gray-500">
                {new Date(r.created_at).toLocaleString('vi-VN')} - {r.admin ? 'Admin' : 'Client'}
              </small>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded p-2"
            placeholder="Nhập phản hồi..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            onClick={handleReply}
            disabled={sending}
          >
            {sending ? 'Đang gửi...' : 'Gửi'}
          </button>
        </div>
      </div>
    </div>
  );
}
