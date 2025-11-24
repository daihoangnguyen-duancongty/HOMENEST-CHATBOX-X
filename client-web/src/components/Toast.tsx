"use client";
import { FC, useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

const Toast: FC<ToastProps> = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`fixed top-5 right-5 px-4 py-2 rounded text-white ${bgColor} shadow-lg`}>
      {message}
    </div>
  );
};

export default Toast;
