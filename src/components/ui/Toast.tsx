'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 250);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    error: <XCircle className="w-4 h-4 text-red-400" />,
    info: <Info className="w-4 h-4 text-blue-400" />,
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 transition-all duration-300
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}
      `}
    >
      <div
        className="
        flex items-center gap-3 px-4 py-3 min-w-[260px] max-w-sm
        rounded-xl shadow-md
        bg-[#111]/95 border border-white/10
        backdrop-blur-sm
      "
      >
        {icons[type]}
        <p className="flex-1 text-sm text-white/90">{message}</p>

        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 250);
          }}
          className="p-1 rounded hover:bg-white/10 transition"
        >
          <X className="w-4 h-4 text-white/70" />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={2500}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
