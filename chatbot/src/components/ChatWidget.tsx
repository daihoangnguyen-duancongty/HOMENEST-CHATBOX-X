// src/components/ChatWidget.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, WidgetProps } from '../types';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { FiSend, FiPaperclip, FiSmile, FiSettings, FiX,FiLink } from 'react-icons/fi';

import { getChatHistory, sendMessageToAI } from '../apis/chatApi';



export const ChatWidget: React.FC<WidgetProps> = ({ clientId, apiEndpoint, visitorId: initialVisitorId  }) => {
 const [clientInfo, setClientInfo] = useState<any>(null);

const botIcon =
  clientInfo?.avatar ||
  "https://homenest.com.vn/wp-content/uploads/2025/06/middle.webp";
  const userAvatar = 'https://img.freepik.com/vector-mien-phi/v%C3%B2ng-tr%C3%B2n-m%C3%A0u-xanh-v%E1%BB%9Bi-ng%C6%B0%E1%BB%9Di-d%C3%B9ng-m%C3%A0u-tr%E1%BA%AFng_78370-4707.jpg?semt=ais_hybrid&w=740&q=80';

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

//Fetch client info khi load widget
useEffect(() => {
  const loadClientInfo = async () => {
    if (!clientId) return;

    const res = await fetch(`${backend}/public/client/${clientId}`);
    const data = await res.json();
    setClientInfo(data);
  };
  loadClientInfo();
}, [clientId, backend]);

  // scroll khi messages thay đổi
const visitorIdKey = `chat_${clientId}_session`;
  const [visitorId, setVisitorId] = useState<string | null>(initialVisitorId || null);


// Tạo hoặc load visitorId từ localStorage

useEffect(() => {
  if (!visitorId) {
    let currentId = localStorage.getItem(visitorIdKey);
    if (!currentId) {
      currentId = crypto.randomUUID();
      localStorage.setItem(visitorIdKey, currentId);
    }
    setVisitorId(currentId);
  }
}, [clientId, visitorId]);

const scrollToBottom = () => {
messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};
useEffect(scrollToBottom, [messages]);

  // load lịch sử chat khi mount
 useEffect(() => {
   if (!clientInfo || !visitorId) return;
  const fetchHistory = async () => {
    const history = await getChatHistory(clientId, visitorId!, backend);
    if (history.length > 0) {
      setMessages(history);
    } else {
      setMessages([{
  from: 'bot', 
  text: clientInfo?.welcome_message || "Xin chào! Mình có thể giúp gì?"
}]);
    }
  };
  fetchHistory();
}, [clientInfo,clientId, visitorId, backend]);



  // gửi tin nhắn
 const sendMessage = async (text: string) => {
  if (!text.trim()) return;
  const userMsg: ChatMessage = { from: 'user', text };
  setMessages(prev => [...prev, userMsg]);
  setInput('');
  setTyping(true);

  // Gọi API visitor
  try {
    const res = await fetch(`${backend}/customer/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        customer_id: visitorId, // <- dùng sessionId
        name: 'Guest',
        avatar: '',
        message: text,
      }),
    });

    const data = await res.json();
    setTyping(false);

    // Lưu visitorId mới nếu backend trả
    if (data.customer_id) {
      localStorage.setItem(`chat_${clientId}_session`, data.customer_id);
    }

    setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
  } catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error("sendMessage error:", message);
    setTyping(false);
    setMessages(prev => [...prev, { from: 'bot', text: "Lỗi kết nối server." }]);
  }
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
       <div className="chat-widget-popup-wrapper">
        
         {/* Send Button */}
{open && (
  <button className="chat-widget-send-button" onClick={() => sendMessage(input)}>
    <FiSend size={22} />
  </button>
)}

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
          <div className="chat-widget-header"  style={{ background: clientInfo?.color || "#0b74ff" }}>
            <div className="chat-widget-header-left">
              <img src={clientInfo?.logo_url || clientInfo?.avatar || userAvatar} alt="User" className="chat-widget-header-avatar" />
    <span>{clientInfo?.name || "CHATBOT X"}</span>
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
                 src={m.from === 'bot' 
    ? (clientInfo?.avatar || botIcon) 
    : userAvatar }
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


          {/* Input wrapper */}
   <div className="chat-widget-input-wrapper">
       {/* Icon trên khung input */}
{/* <div className="chat-widget-input-top-icons-wrapper">


 <FiLink size={13} className="chat-widget-input-top-icons" />
 <FiLink size={13} className="chat-widget-input-top-icons" />
</div> */}
      {/* Input */}
  <input
    className="chat-widget-input-text"
    type="text"
    value={input}
    onChange={e => setInput(e.target.value)}
    onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
    placeholder="Nhập tin nhắn..."
  />
   



  {/* Icon dưới khung input */}
  <div className="chat-widget-input-bottom-icons">
    {/* File */}
    <label className="chat-widget-file-button">
      <FiPaperclip size={20} />
      <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
    </label>

    {/* Emoji */}
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowEmojiPicker(prev => !prev)} className="chat-widget-smile-button">
        <FiSmile size={20} />
      </button>
     {showEmojiPicker && (
    <div className="chat-widget-emoji-picker right">
      <EmojiPicker
        onEmojiClick={onEmojiClick}
        height={450}
        width={350}
      />
    </div>
  )}

    </div>
  </div>

  {/* Powered by HomeNest */}
  <div className="chat-widget-powered">
    <hr/>
    Powered by  <img
      src="https://homenest.com.vn/wp-content/uploads/2025/07/Logo_HomeNest-team.webp"
      alt="HomeNest"
    /> HomeNest
  </div>
</div>

 
        </div>
      )}
    </div>
    </div>
  );
};
