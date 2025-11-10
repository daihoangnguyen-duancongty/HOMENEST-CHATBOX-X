export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

export interface WidgetProps {
  clientId: string;
  apiEndpoint?: string; // mặc định backend API nếu muốn override
}
