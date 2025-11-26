'use client';

import { useState } from 'react';
import { FaCode, FaWordpress, FaReact, FaVuejs } from 'react-icons/fa';
import { useAuthStore } from '@/store/authSlice';

export default function ChatbotSettings() {
  const user = useAuthStore((s) => s.user);
  const clientId = (user as any)?.clientId;
  const [clientColor, setClientColor] = useState('#0b74ff');
  const [platform, setPlatform] = useState<'wordpress' | 'react' | 'vue'>('wordpress');

  const generateScript = () => {
    if (!clientId) return '';

    let scriptSrc = 'https://yourcdn.com/chatbot-widget.js';

    if (platform === 'react') {
      scriptSrc = 'https://yourcdn.com/chatbot-widget-react.js';
    } else if (platform === 'vue') {
      scriptSrc = 'https://yourcdn.com/chatbot-widget-vue.js';
    }

    return `<script>
window.HOMENEST_CHATBOT_WIDGET = window.HOMENEST_CHATBOT_WIDGET || {
  clientId: "${clientId}",
  apiEndpoint: "https://homenest-chatbox-x-production.up.railway.app/api",
  visitorId: null
};
(function() {
  const s = document.createElement('script');
  s.src = "${scriptSrc}";
  s.async = true;
  document.head.appendChild(s);
})();
</script>`;
  };


  const getPlatformInstruction = () => {
    switch (platform) {
      case 'wordpress':
        return `Dán script vào Header/Footer (plugin: Insert Headers and Footers).`;
      case 'react':
        return `Dán vào public/index.html hoặc inject script bằng useEffect.`;
      case 'vue':
        return `Dán vào public/index.html hoặc inject script bằng mounted().`;
      default:
        return '';
    }
  };

  return (
 <div className="p-6 flex justify-start w-[100%]">
  <div className="w-[80vw] ">
        
        <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Cài đặt Chatbot
        </h1>

        {/* SELECT PLATFORM */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Chọn loại website:</label>

          <div className="flex gap-3">
            <button
              onClick={() => setPlatform('wordpress')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm transition
                ${platform === 'wordpress'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
            >
              <FaWordpress /> WordPress
            </button>

            <button
              onClick={() => setPlatform('react')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm transition
                ${platform === 'react'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
            >
              <FaReact /> React
            </button>

            <button
              onClick={() => setPlatform('vue')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border shadow-sm transition
                ${platform === 'vue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
            >
              <FaVuejs /> Vue
            </button>
          </div>
        </div>

        {/* SCRIPT BOX */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
            <FaCode /> Script nhúng:
          </label>

          <textarea
            readOnly
            value={generateScript()}
            className="w-full p-3 border rounded-lg h-48 font-mono 
                       bg-white/70 backdrop-blur-sm shadow-inner text-sm"
          />
        </div>

        {/* INSTRUCTION */}
        <div className="mt-4 p-4 bg-white/50 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-700 text-sm">
            <b className="text-blue-700">Hướng dẫn cho {platform.toUpperCase()}:</b>  
            <br /> {getPlatformInstruction()}
          </p>
        </div>


      </div>
    </div>
  );
}
