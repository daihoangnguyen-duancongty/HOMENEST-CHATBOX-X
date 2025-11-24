import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

// type cho animation JSON Lottie
type LottieAnimationData = object;

export default function LoadingOverlay({
  open,
  message = 'Vui lòng đợi trong giây lát...',
}: LoadingOverlayProps) {
  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch('/loading.json')
      .then((res) => res.json())
      .then((data: LottieAnimationData) => setAnimationData(data))
      .catch((err) => console.error('Cannot load Lottie animation:', err));
  }, []);

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40'>
      <div className='w-32 h-32 mb-4'>
        {animationData && <Lottie animationData={animationData} loop />}
      </div>
      <p className='text-white text-lg font-medium'>{message}</p>
    </div>
  );
}
