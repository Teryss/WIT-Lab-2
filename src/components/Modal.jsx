import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';

export default function Modal({ open, onClose, children, size = 'md' }) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const widthClass =
    size === 'lg'
      ? 'max-w-5xl'
      : size === 'xl'
        ? 'max-w-6xl'
        : size === 'sm'
          ? 'max-w-md'
          : 'max-w-2xl';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        className={`relative bg-white rounded-2xl shadow-lift w-full ${widthClass} max-h-[92vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-soft inline-flex items-center justify-center"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
        <div className="overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
