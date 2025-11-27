import React from "react";
import ReactDOM from "react-dom/client";
import { ChatWidget } from "./components/ChatWidget";

// any để TS không complain về window.HOMENEST_CHATBOT_WIDGET
const config = (window as any).HOMENEST_CHATBOT_WIDGET || {};
const { clientId, apiEndpoint, apiKey } = config;

// Tạo sessionId visitor nếu chưa có
let sessionId = localStorage.getItem(`chat_${clientId}_session`);
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem(`chat_${clientId}_session`, sessionId);
}

// Khởi tạo React widget
const rootEl = document.createElement("div");
document.body.appendChild(rootEl);
const root = ReactDOM.createRoot(rootEl);

root.render(
  <ChatWidget
    clientId={clientId!}
    apiEndpoint={apiEndpoint!}
    apiKey={apiKey!}
    visitorId={sessionId}
  />
);
