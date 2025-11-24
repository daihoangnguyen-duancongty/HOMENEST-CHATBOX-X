// src/apis/authApi.ts
export const login = async (username: string, password: string) => {
  const widget = window.HOMENEST_CHATBOT_WIDGET;
  if (!widget) throw new Error("Missing HOMENEST_CHATBOT_WIDGET");

  const endpoint = widget.apiEndpoint; // ví dụ: https://homenest-chatbox-x-production.up.railway.app/api
  if (!endpoint) throw new Error("Missing apiEndpoint");

  // gọi đúng endpoint mới
const res = await fetch(`${endpoint}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
});
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Login failed");

  const token = data.token;
  const payload = JSON.parse(atob(token.split(".")[1]));

  widget.token = token;
  widget.clientId = payload.clientId;

  return payload.clientId;
};
