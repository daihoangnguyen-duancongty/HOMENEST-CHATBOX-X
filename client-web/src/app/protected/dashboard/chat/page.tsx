'use client';
import { useEffect, useState } from 'react';
import { ICustomer, IMessage, getCustomers, getMessages, sendMessage, switchCustomerToHuman } from '@/api/client-owner';

export default function CustomerChat() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');

  const clientId = 'testclient123'; // Hoặc lấy từ JWT

  const fetchAllCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  const fetchCustomerMessages = async (customerId: string) => {
    const data = await getMessages(clientId, customerId);
    setMessages(data);
  };

  const handleSelectCustomer = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    fetchCustomerMessages(customer.customerId);
  };

  const handleSend = async () => {
    if (!selectedCustomer || !newMsg) return;
    await sendMessage(selectedCustomer.customerId, newMsg);
    setMessages([...messages, {
      _id: Date.now().toString(),
      from: 'employee',
      text: newMsg,
      timestamp: new Date().toISOString()
    }]);
    setNewMsg('');
  };

  const handleSwitchHuman = async () => {
    if (!selectedCustomer) return;
    await switchCustomerToHuman(selectedCustomer.customerId);
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
          <li key={c.customerId} className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => handleSelectCustomer(c)}>
            <img src={c.avatar || '/default-avatar.png'} alt="" className="w-8 h-8 rounded-full inline mr-2"/>
            {c.name} {c.chatMode === 'human' && "(Human)"}
          </li>
        ))}
      </ul>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map(m => (
            <div key={m._id} className={`mb-2 p-2 rounded ${m.from === 'employee' ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'} max-w-xs`}>
              {m.text}
              <div className="text-xs text-gray-500">{new Date(m.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>

        {selectedCustomer && selectedCustomer.chatMode === 'bot' && (
          <div className="p-4 border-t flex gap-2">
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              className="flex-1 border rounded p-2"
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">Gửi</button>
            <button onClick={handleSwitchHuman} className="bg-red-600 text-white px-4 py-2 rounded">Chuyển Human</button>
          </div>
        )}
      </div>
    </div>
  );
}
