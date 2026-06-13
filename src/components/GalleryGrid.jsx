import { useState } from 'react';
import DrawingCard from './DrawingCard';
import DrawingModal from './DrawingModal';

export default function GalleryGrid({ drawings }) {
  const [active, setActive] = useState(null);

  if (drawings.length === 0) {
    return (
      <div className="bg-white border border-dashed border-neutral-300 rounded-2xl p-10 text-center">
        <p className="text-neutral-500">
          No works match the selected filters. Try changing the criteria or
          resetting the filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {drawings.map((d) => (
          <DrawingCard key={d.id} drawing={d} onOpen={setActive} />
        ))}
      </div>
      <DrawingModal
        drawing={active}
        open={!!active}
        onClose={() => setActive(null)}
      />
    </>
  );
}
