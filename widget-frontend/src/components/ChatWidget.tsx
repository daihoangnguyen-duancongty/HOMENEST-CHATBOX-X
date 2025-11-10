import React, { useState } from 'react';
import axios from 'axios';
import { ChatMessage, WidgetProps } from '../types';

export const ChatWidget: React.FC<WidgetProps> = ({ clientId, apiEndpoint }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const backend = apiEndpoint || 'https://api.yourdomain.com/api/chat';

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const resp = await axios.post(backend, {
        client_id: clientId,
        message: userMsg.text
      });
      const botMsg: ChatMessage = { from: 'bot', text: resp.data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg: ChatMessage = { from: 'bot', text: 'Lỗi kết nối server.' };
      setMessages(prev => [...prev, botMsg]);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, width: 300, border: '1px solid #ccc', borderRadius: 8, background: '#fff', padding: 8 }}>
      <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === 'user' ? 'right' : 'left', margin: '4px 0' }}>
            <span style={{ background: m.from === 'user' ? '#0b74ff' : '#eee', color: m.from === 'user' ? '#fff' : '#000', borderRadius: 4, padding: '4px 8px', display: 'inline-block' }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc' }} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
        <button onClick={sendMessage} style={{ padding: '4px 8px', borderRadius: 4, background: '#0b74ff', color: '#fff', border: 'none' }}>Send</button>
      </div>
    </div>
  );
};
