export {};

declare global {
  interface Window {
    HOMENEST_CHATBOT_WIDGET: {
      apiEndpoint?: string;
       token?: string | null;
      clientId: string | null;
    };
  }
}
