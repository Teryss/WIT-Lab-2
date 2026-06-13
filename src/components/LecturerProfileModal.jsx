import { useMemo, useState } from 'react';
import { Check, Link as LinkIcon, Share2 } from 'lucide-react';
import Modal from './Modal';
import { portraitSvg } from '../lib/artwork';

export default function LecturerProfileModal({ lecturer, open, onClose }) {
  const [copied, setCopied] = useState(false);
  const portrait = useMemo(
    () =>
      lecturer
        ? portraitSvg({
            firstName: lecturer.firstName,
            lastName: lecturer.lastName,
            seed: lecturer.id,
          })
        : '',
    [lecturer],
  );

  if (!lecturer) return null;

  const share = async () => {
    const url = `${window.location.origin}/lecturers#${lecturer.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="grid md:grid-cols-[1fr,1.2fr] gap-0">
        <div className="aspect-[4/5] md:aspect-auto md:min-h-[460px] bg-neutral-100">
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: portrait }}
          />
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 font-semibold">
            {lecturer.degree}
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-neutral-900">
            {lecturer.firstName} {lecturer.lastName}
          </h2>
          <p className="mt-1 text-accent font-semibold">{lecturer.position}</p>

          <div className="mt-6">
            <p className="text-sm font-bold text-neutral-900">Description</p>
            <p className="mt-2 text-neutral-700 leading-relaxed">{lecturer.bio}</p>
          </div>

          {lecturer.tags?.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {lecturer.tags.map((t) => (
                <span key={t} className="tag-pill">
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6">
            <p className="text-sm font-bold text-neutral-900">Portfolio</p>
            <a
              href={lecturer.portfolioUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1 inline-flex items-center gap-2 text-accent hover:underline break-all"
            >
              <LinkIcon size={14} />
              {lecturer.portfolioUrl}
            </a>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={share}
              className="btn-pill btn-pill-silver"
            >
              {copied ? (
                <>
                  <Check size={16} className="mr-2" /> Link copied
                </>
              ) : (
                <>
                  <Share2 size={16} className="mr-2" /> Share
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
