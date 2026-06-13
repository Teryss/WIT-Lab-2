import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import MobileNav from './MobileNav';

const LINKS = [
  { to: '/about', label: 'About the Workshop' },
  { to: '/lecturers', label: 'Lecturers' },
  { to: '/gallery', label: 'Work Archive' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto h-16 px-5 md:px-8 flex items-center justify-between">
          <Link
            to="/"
            className="font-extrabold tracking-[0.18em] text-neutral-900 text-sm md:text-base"
            aria-label="Akademia WIT — Drawing Gallery home"
            onClick={() => setOpen(false)}
          >
            LOGO
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? 'text-accent'
                    : 'text-neutral-700 hover:text-accent'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-neutral-900"
            aria-label="Open menu"
          >
            <Menu size={26} strokeWidth={2.2} />
          </button>
        </div>
      </header>
      <MobileNav open={open} onClose={() => setOpen(false)} links={LINKS} />
    </>
  );
}
