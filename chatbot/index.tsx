// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWidget } from './src/components/ChatWidget';

declare global {
  interface Window {
    ABC_CHATBOT_WIDGET?: { clientId: string; apiEndpoint?: string };
  }
}

const widgetConfig = window.ABC_CHATBOT_WIDGET;

if (widgetConfig?.clientId) {
  const container = document.getElementById('HomeNest-chatbot-widget');
  if (container) {
    ReactDOM.createRoot(container).render(
      <ChatWidget clientId={widgetConfig.clientId} apiEndpoint={widgetConfig.apiEndpoint} />
    );
  } else {
    console.error('Cannot find #abc-chatbot-widget in DOM');
  }
} else {
  console.error('Missing clientId for widget');
}
