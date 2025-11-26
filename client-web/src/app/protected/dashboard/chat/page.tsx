'use client';
import { useEffect, useState, useRef } from 'react';
import { getCustomers, getMessages, sendMessage, switchCustomerToHuman } from '@/api/client-owner';
import { ICustomer, IMessage } from '@/types/client-owner-types';
import { useAuthStore } from '@/store/authSlice';

export default function CustomerChat() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();
  const clientId = user?.clientId;

  // Scroll xuống cuối mỗi khi messages thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAllCustomers = async () => {
    if (!clientId) return;
    const data = await getCustomers(clientId);
    setCustomers(data);
  };

  const fetchCustomerMessages = async (customerId: string) => {
    if (!clientId) return;
    const data = await getMessages(clientId, customerId);
    setMessages(data);
  };

  const handleSelectCustomer = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    fetchCustomerMessages(customer.customerId);
  };

  const handleSend = async () => {
    if (!selectedCustomer || !newMsg.trim()) return;

    // Gửi lên server
    const ok = await sendMessage(selectedCustomer.customerId, newMsg.trim());
    if (!ok) return;

    // Cập nhật frontend
    setMessages(prev => [
      ...prev,
      {
        _id: Date.now().toString(),
        from: 'employee',
        text: newMsg.trim(),
        timestamp: new Date().toISOString(),
      },
    ]);
    setNewMsg('');
  };

  const handleSwitchHuman = async () => {
    if (!selectedCustomer) return;
    const ok = await switchCustomerToHuman(selectedCustomer.customerId);
    if (!ok) return;
    setSelectedCustomer({ ...selectedCustomer, chatMode: 'human' });
  };

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ul className="w-1/4 border-r overflow-y-auto">
        {customers.map(c => (
          <li
            key={c.customerId}
            className={`cursor-pointer p-2 hover:bg-gray-200 ${
              selectedCustomer?.customerId === c.customerId ? 'bg-gray-300' : ''
            }`}
            onClick={() => handleSelectCustomer(c)}
          >
            <img
              src={c.avatar || '/default-avatar.png'}
              alt=""
              className="w-8 h-8 rounded-full inline mr-2"
            />
            {c.name} {c.chatMode === 'human' && '(Human)'}
          </li>
        ))}
      </ul>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-2">
          {messages.map(m => (
            <div
              key={m._id}
              className={`p-2 rounded max-w-xs ${
                m.from === 'employee' ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'
              }`}
            >
              {m.text}
              <div className="text-xs text-gray-500">
                {new Date(m.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        {selectedCustomer && (
          <div className="p-4 border-t flex gap-2">
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 border rounded p-2"
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Gửi
            </button>
            {selectedCustomer.chatMode === 'bot' && (
              <button
                onClick={handleSwitchHuman}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Chuyển Human
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
