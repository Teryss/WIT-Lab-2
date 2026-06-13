import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';

export default function MobileNav({ open, onClose, links }) {
  useLockBodyScroll(open);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col no-scrollbar overflow-y-auto">
      <div className="h-16 px-5 flex items-center justify-between border-b border-neutral-200">
        <span className="font-extrabold tracking-[0.18em] text-sm">LOGO</span>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 -mr-2 inline-flex items-center justify-center"
          aria-label="Close menu"
        >
          <X size={26} strokeWidth={2.2} />
        </button>
      </div>
      <nav className="flex-1 px-6 py-10 flex flex-col gap-6">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            onClick={onClose}
            className="text-3xl font-semibold text-neutral-900 hover:text-accent transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
