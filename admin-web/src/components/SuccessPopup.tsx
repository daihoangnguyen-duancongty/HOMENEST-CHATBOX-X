import { useEffect } from 'react';
import { HiCheckCircle } from 'react-icons/hi';

interface SuccessPopupProps {
  open: boolean;
  message: string;
  onClose: () => void;
  autoClose?: boolean; // tự đóng
  duration?: number; // thời gian tự đóng (ms)
}

export default function SuccessPopup({
  open,
  message,
  onClose,
  autoClose = false,
  duration = 1000,
}: SuccessPopupProps) {
  useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, autoClose, duration, onClose]);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white rounded-xl p-6 flex flex-col items-center gap-4 min-w-[280px]'>
        <HiCheckCircle className='text-green-500 w-14 h-14' />
        <p className='text-lg font-bold text-center'>{message}</p>
      </div>
    </div>
  );
}
