//Build xong sẽ tạo ra một bundle.js để nhúng vào WordPress page.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWidget } from './src/components/ChatWidget';

declare global { interface Window { ABC_CHATBOT_WIDGET?: { clientId:string, apiEndpoint?:string } } }

const widgetConfig = window.ABC_CHATBOT_WIDGET;
if(widgetConfig?.clientId){
  const root = document.createElement('div');
  document.body.appendChild(root);
  ReactDOM.createRoot(root).render(<ChatWidget clientId={widgetConfig.clientId} apiEndpoint={widgetConfig.apiEndpoint} />);
} else {
  console.error('Missing clientId for widget');
}
