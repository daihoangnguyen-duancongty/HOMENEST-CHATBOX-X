import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChatMessage, WidgetProps } from '../types';
import { BASE_URL } from '../apis/fetcher';

export const ChatWidget: React.FC<WidgetProps> = ({ clientId, apiEndpoint }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [quickActions, setQuickActions] = useState([
    { label: 'Xem sản phẩm', payload: 'xem_san_pham' },
    { label: 'Liên hệ CSKH', payload: 'lien_he' },
    { label: 'FAQ nhanh', payload: 'faq' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const backend = apiEndpoint || BASE_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Tin nhắn chào mừng khi mở chat lần đầu
  useEffect(() => {
    if (open && messages.length === 0) {
      const welcomeMsg: ChatMessage = {
        from: 'bot',
        text: 'Chào mừng bạn trở lại với HOMENEST CHATBOT X 😊'
      };
      setMessages([welcomeMsg]);
    }
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      setTyping(true);
      const resp = await axios.post(backend, {
        client_id: clientId,
        message: text
      });
      setTyping(false);

      const botMsg: ChatMessage = { from: 'bot', text: resp.data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setTyping(false);
      console.error(err);
      const botMsg: ChatMessage = { from: 'bot', text: 'Lỗi kết nối server.' };
      setMessages(prev => [...prev, botMsg]);
    }
  };

  const handleQuickAction = (action: { label: string; payload: string }) => {
    sendMessage(action.payload);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const userMsg: ChatMessage = { from: 'user', text: `📎 ${file.name}` };
    setMessages(prev => [...prev, userMsg]);
    // TODO: gửi file lên backend nếu cần
  };

  const handleEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
  };

  return (
    <div className="chat-widget-container">
      {/* Nút mở chat */}
      {!open && (
        <button onClick={() => setOpen(true)} className="chat-widget-button">
          X Bot 
        </button>
      )}

      {/* Popup chat */}
      {open && (
        <div className="chat-widget-popup">
          {/* Header */}
          <div className="chat-widget-header">
            <span> X BOT</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="chat-widget-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-widget-message ${m.from === 'user' ? 'user' : 'bot'}`}
              >
                {m.text}
              </div>
            ))}
            {typing && <div className="chat-widget-typing">...</div>}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="chat-widget-quick-actions">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  className="quick-action-button"
                  onClick={() => handleQuickAction(action)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-widget-input">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={() => sendMessage(input)}>Gửi</button>

            {/* Upload file */}
            <label className="chat-widget-file-button">
              📎
              <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
            </label>

            {/* Emoji picker đơn giản */}
            <button
              className="chat-widget-emoji-button"
              onClick={() => handleEmoji('😊')}
            >
              😊
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
