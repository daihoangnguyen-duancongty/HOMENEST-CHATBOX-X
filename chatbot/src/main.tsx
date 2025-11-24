import React from "react";
import ReactDOM from "react-dom/client";
import { ChatWidget } from "./components/ChatWidget";
import { login } from "./apis/authApi";

declare global {
  interface Window {
    HOMENEST_CHATBOT_WIDGET?: {
      apiEndpoint?: string;
      token: string | null;
      clientId: string | null;
    };
  }
}

// giá trị mặc định nếu chưa set
window.HOMENEST_CHATBOT_WIDGET = window.HOMENEST_CHATBOT_WIDGET || {
  apiEndpoint: "https://homenest-chatbox-x-production.up.railway.app/api",
  token: null,
  clientId: null,
};

const widgetConfig = window.HOMENEST_CHATBOT_WIDGET;

// Hàm khởi tạo widget sau login
async function initWidget(username: string, password: string) {
  try {
    const clientId = await login(username, password);

    const rootEl = document.createElement("div");
    document.body.appendChild(rootEl);
    const root = ReactDOM.createRoot(rootEl);

    root.render(
      <ChatWidget clientId={clientId} apiEndpoint={widgetConfig.apiEndpoint} />
    );
  } catch (err) {
    console.error("Login failed:", err);
  }
}

// --- Ví dụ gọi initWidget với username/password employee ---
// (Trong production, username/password sẽ lấy từ form login)
initWidget("owner014", "123456");
