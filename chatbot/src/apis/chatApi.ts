// src/apis/chatApi.ts
import axios from 'axios';
import { ChatMessage } from '../types';
import { BASE_URL } from './fetcher';

interface SendMessageResponse {
  reply: string;
}

interface GetMessagesResponse {
  messages: ChatMessage[];
}

/**
 * Gửi tin nhắn tới AI và nhận phản hồi
 * @param clientId clientId
 * @param message nội dung tin nhắn
 * @param backend backend URL
 */
export const getChatHistory = async (clientId: string, visitorId: string, backend: string) => {
  try {
    const res = await fetch(`${backend}/customer/chat/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, customer_id: visitorId }),
    });
    const data = await res.json();
    return data.messages || [];
  } catch (err) {
    console.error("getChatHistory error:", err);
    return [];
  }
};

export const sendMessageToAI = async (
  clientId: string,
  message: string,
  backend: string = BASE_URL
) => {
  try {
    const token = window.HOMENEST_CHATBOT_WIDGET?.token;
    if (!token || !clientId) throw new Error("Missing token or clientId");

    const res = await axios.post(
      `${backend}/admin-api/chat`,
      { message, clientId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.reply;
  } catch (err) {
    console.error("sendMessageToAI error:", err);
    return "Lỗi kết nối server.";
  }
};




