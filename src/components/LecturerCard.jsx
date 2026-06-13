import { useMemo } from 'react';
import { portraitSvg } from '../lib/artwork';

export default function LecturerCard({ lecturer, onOpen }) {
  const portrait = useMemo(
    () =>
      portraitSvg({
        firstName: lecturer.firstName,
        lastName: lecturer.lastName,
        seed: lecturer.id,
      }),
    [lecturer],
  );

  return (
    <button
      type="button"
      onClick={() => onOpen?.(lecturer)}
      className="text-left bg-white rounded-xl2 border border-neutral-200 shadow-soft hover:shadow-lift transition-shadow overflow-hidden flex flex-col w-full focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      <div className="aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
        <div
          className="w-full h-full block"
          dangerouslySetInnerHTML={{ __html: portrait }}
        />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-neutral-900 text-lg">
          {lecturer.firstName} {lecturer.lastName}
        </h3>
        <p className="text-sm text-accent font-medium mt-1">{lecturer.position}</p>
      </div>
    </button>
  );
}
