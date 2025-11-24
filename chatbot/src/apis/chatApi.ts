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
export const getChatHistory = async (clientId: string, backend: string = BASE_URL) => {
  try {
    const res = await axios.get(`${backend}/${clientId}`);
    return res.data.messages || [];
  } catch (err) {
    console.error('getChatHistory error:', err);
    return [];
  }
};

export const sendMessageToAI = async (clientId: string, message: string, backend: string = BASE_URL) => {
  try {
    const res = await axios.post(backend, { client_id: clientId, message });
    return res.data.reply;
  } catch (err) {
    console.error('sendMessageToAI error:', err);
    return 'Lỗi kết nối server.';
  }
};


