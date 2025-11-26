

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

export interface WidgetProps {
  clientId: string;
  apiEndpoint: string;
  visitorId?: string; // sessionId visitor
}