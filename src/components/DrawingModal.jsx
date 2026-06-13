import { useEffect, useState } from 'react';
import { Check, Share2, ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';
import Modal from './Modal';
import DrawingScan from './DrawingScan';
import { useImageViewer } from '../lib/useImageViewer';

export default function DrawingModal({ drawing, open, onClose }) {
  const [copied, setCopied] = useState(false);
  const viewer = useImageViewer();

  // Reset the viewer every time a new drawing is opened.
  useEffect(() => {
    if (open) viewer.actions.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, drawing?.id]);

  if (!drawing) return null;

  const share = async () => {
    const url = `${window.location.origin}/gallery#${drawing.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
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

  const { scale, x, y, rot } = viewer.transform;

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose?.();
        viewer.actions.reset();
      }}
      size="xl"
    >
      <div className="grid lg:grid-cols-[1.4fr,1fr]">
        <div className="bg-canvas-muted p-4 md:p-6 relative">
          {/* Toolbar — pushed left of the modal's close button so the two
              never collide on narrow viewports. */}
          <div className="absolute top-3 right-14 sm:right-3 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={viewer.actions.zoomOut}
              aria-label="Zoom out"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-soft inline-flex items-center justify-center"
            >
              <ZoomOut size={16} />
            </button>
            <button
              type="button"
              onClick={viewer.actions.zoomIn}
              aria-label="Zoom in"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-soft inline-flex items-center justify-center"
            >
              <ZoomIn size={16} />
            </button>
            <button
              type="button"
              onClick={viewer.actions.rotate}
              aria-label="Rotate 90°"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-soft inline-flex items-center justify-center"
            >
              <RotateCw size={15} />
            </button>
            <button
              type="button"
              onClick={viewer.actions.reset}
              aria-label="Reset view"
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-soft inline-flex items-center justify-center"
            >
              <Maximize2 size={14} />
            </button>
          </div>

          {/* Viewer surface — captures wheel/pointer events. */}
          <div
            ref={viewer.containerCallbackRef}
            {...viewer.handlers}
            className="relative overflow-hidden max-h-[70vh] h-[60vh] lg:h-[70vh] bg-white rounded-xl border border-neutral-200 touch-none select-none"
            style={{ cursor: viewer.cursor }}
            role="img"
            aria-label={`Zoomable scan: ${drawing.title}`}
          >
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rot}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 80ms linear',
                willChange: 'transform',
              }}
            >
              <div className="w-[min(100%,520px)] aspect-[4/5] shadow-soft rounded-md overflow-hidden">
                <DrawingScan drawing={drawing} label={drawing.title} />
              </div>
            </div>

            {scale <= 1.01 ? (
              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-wider text-neutral-500 bg-white/80 px-2 py-1 rounded-full pointer-events-none">
                Drag to pan · scroll or pinch to zoom
              </p>
            ) : null}
          </div>

          <p className="text-xs text-neutral-400 mt-2 text-center">
            Zoom: {Math.round(scale * 100)}% · Rotation: {rot}°
          </p>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold">
            {drawing.academicYear}
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-neutral-900">
            {drawing.title}
          </h2>
          <p className="mt-1 text-sm uppercase tracking-wider text-neutral-500">
            {drawing.author.firstName} {drawing.author.lastName}
          </p>

          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-bold text-neutral-900">Technique</dt>
              <dd className="text-neutral-700">
                {drawing.technique} ({drawing.techniqueLabel})
              </dd>
            </div>
            <div>
              <dt className="font-bold text-neutral-900">Semester</dt>
              <dd className="text-neutral-700">Semester {drawing.semester}</dd>
            </div>
            <div>
              <dt className="font-bold text-neutral-900">Instructor</dt>
              <dd className="text-neutral-700">{drawing.supervisor}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
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
