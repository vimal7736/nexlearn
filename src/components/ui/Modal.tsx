'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = false,
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      <div className={cn('relative bg-white rounded-xl shadow-2xl w-full', sizes[size])}>

        {(title || showCloseButton) && (
          <div className="p-2 border-b border-gray-200 flex items-center justify-between">
            {title && <h2 className="text-sm text-gray-900">{title}</h2>}

            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>

        {!showCloseButton && (
          <div className="p-4 flex justify-end">
            <Button
              size="sm"
              className="ml-auto px-6 py-1 text-xs flex items-center justify-center"
              onClick={onClose}
            >
              Minimise
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
