// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ChatWidget } from "./components/ChatWidget";

window.HOMENEST_CHATBOT_WIDGET = window.HOMENEST_CHATBOT_WIDGET || {
apiEndpoint: "https://homenest-chatbox-x-production.up.railway.app/api",
clientId: "ZneprqhEanMv",
};

const { clientId, apiEndpoint } = window.HOMENEST_CHATBOT_WIDGET;

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

root.render( <ChatWidget clientId={clientId!} apiEndpoint={apiEndpoint!} visitorId={sessionId} />
);
