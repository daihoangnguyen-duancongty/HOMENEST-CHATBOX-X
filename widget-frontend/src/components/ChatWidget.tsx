// src/components/ChatWidget.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, WidgetProps } from '../types';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { FiSend, FiPaperclip, FiSmile, FiSettings, FiX } from 'react-icons/fi';
import { getChatHistory, sendMessageToAI } from '../apis/chatApi';

export const ChatWidget: React.FC<WidgetProps> = ({ clientId, apiEndpoint }) => {
  const botIcon =
    'https://static.vecteezy.com/system/resources/thumbnails/071/433/877/small/ai-chatbot-icon-a-friendly-robot-symbol-in-a-speech-bubble-for-digital-communication-png.png';
  const userAvatar = 'https://via.placeholder.com/36';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [quickActions] = useState([
    { label: 'Xem sản phẩm', payload: 'xem_san_pham' },
    { label: 'Liên hệ CSKH', payload: 'lien_he' },
    { label: 'FAQ nhanh', payload: 'faq' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const backend = apiEndpoint || '';

  // scroll khi messages thay đổi
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  // load lịch sử chat khi mount
  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getChatHistory(clientId, backend);
      if (history.length > 0) {
        setMessages(history);
      } else {
        setMessages([{ from: 'bot', text: 'Chào mừng bạn trở lại với HOMENEST CHATBOT X 😊' }]);
      }
    };
    fetchHistory();
  }, [clientId, backend]);

  // gửi tin nhắn
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    const reply = await sendMessageToAI(clientId, text, backend);
    setTyping(false);
    setMessages(prev => [...prev, { from: 'bot', text: reply }]);
  };

  const handleQuickAction = (action: { label: string; payload: string }) => sendMessage(action.payload);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessages(prev => [...prev, { from: 'user', text: `📎 ${file.name}` }]);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => setInput(prev => prev + emojiData.emoji);

  return (
    <div className="chat-widget-container">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="chat-widget-button-img"
          aria-label="Mở chat bot"
        >
          <img
            src={botIcon}
            alt="Chatbot"
            style={{ width: '70px', height: '70px' }}
            className="rounded-full object-cover shadow-md border border-gray-200"
          />
        </button>
      )}

      {open && (
        <div className="chat-widget-popup">
          {/* Header */}
          <div className="chat-widget-header">
            <div className="chat-widget-header-left">
              <img src={userAvatar} alt="User" className="chat-widget-header-avatar" />
              <span>X BOT HOMENEST</span>
            </div>
            <div className="chat-widget-header-right">
              <div className="chat-widget-settings-wrapper">
                <FiSettings
                  size={20}
                  className="chat-widget-settings-icon"
                  onClick={() => setShowSettings(prev => !prev)}
                />
                {showSettings && (
                  <div className="chat-widget-settings-dropdown">
                    <div className="chat-widget-settings-item">Chỉnh sửa thông tin</div>
                    <div className="chat-widget-settings-item">Đổi theme</div>
                    <div className="chat-widget-settings-item">Thoát chat</div>
                  </div>
                )}
              </div>
              <button className="chat-widget-close-button" onClick={() => setOpen(false)}>
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-widget-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-widget-message-wrapper ${m.from === 'user' ? 'user' : 'bot'}`}>
                <img
                  src={m.from === 'bot' ? botIcon : userAvatar}
                  alt={m.from}
                  className="chat-widget-message-avatar"
                />
                <div className={`chat-widget-message ${m.from}`}>{m.text}</div>
              </div>
            ))}
            {typing && <div className="chat-widget-typing">...</div>}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div className="chat-widget-quick-actions">
              {quickActions.map((action, i) => (
                <button key={i} className="quick-action-button" onClick={() => handleQuickAction(action)}>
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-widget-input">
            <input
              className="chat-widget-input-text"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Nhập tin nhắn..."
            />
            <button className="chat-widget-send-button" onClick={() => sendMessage(input)}>
              <FiSend size={22} />
            </button>
            <label className="chat-widget-file-button">
              <FiPaperclip size={18} color="#dadedfff" />
              <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
            </label>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowEmojiPicker(prev => !prev)} className="chat-widget-smile-button">
                <FiSmile size={20} color="#dadedfff" />
              </button>
              {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: '50px', right: 0, zIndex: 1100 }}>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
