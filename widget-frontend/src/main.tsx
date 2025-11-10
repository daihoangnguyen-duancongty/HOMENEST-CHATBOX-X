import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWidget } from './components/ChatWidget';

declare global {
  interface Window {
    ABC_CHATBOT_WIDGET?: { clientId: string; apiEndpoint?: string };
  }
}

// đọc clientId từ global window object
const widgetConfig = window.ABC_CHATBOT_WIDGET;
if (!widgetConfig?.clientId) {
  console.error('Missing clientId for ABC Chatbot Widget');
} else {
  const root = document.createElement('div');
  document.body.appendChild(root);
  const rootEl = ReactDOM.createRoot(root);
  rootEl.render(<ChatWidget clientId={widgetConfig.clientId} apiEndpoint={widgetConfig.apiEndpoint} />);
}
