export {};

declare global {
  interface Window {
    ABC_CHATBOT_WIDGET: {
      apiEndpoint?: string;
      token: string | null;
      clientId: string | null;
    };
  }
}
