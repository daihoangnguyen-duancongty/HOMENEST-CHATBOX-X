"use client";

import { useState } from "react";
import { fetcher } from "@/config/fetcher";

export default function SupportPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetcher("/client/support", {
        method: "POST",
        data: { message },
      });
      alert("Gửi yêu cầu hỗ trợ thành công!");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Không gửi được yêu cầu!");
    }

    setLoading(false);
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Liên hệ hỗ trợ</h1>

      <form onSubmit={submit} className='space-y-4'>
        <textarea
          className='w-full p-3 border rounded text-black'
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Nhập nội dung hỗ trợ bạn muốn gửi đến quản trị...'
        />

        <button
          type='submit'
          disabled={loading}
          className='bg-pink-600 text-white px-4 py-2 rounded'
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>
    </div>
  );
}
