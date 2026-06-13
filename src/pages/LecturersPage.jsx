import { useState } from 'react';
import { LECTURERS } from '../data/lecturers';
import LecturerCard from '../components/LecturerCard';
import LecturerProfileModal from '../components/LecturerProfileModal';

export default function LecturersPage() {
  const [active, setActive] = useState(null);

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-20">
      <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 text-center">
        Lecturers
      </h1>
      <p className="mt-3 text-neutral-500 text-center max-w-2xl mx-auto">
        Meet the lecturers and workshop leaders behind the works in the archive.
        Click a card to read their full profile and open their portfolio.
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LECTURERS.map((l) => (
          <LecturerCard key={l.id} lecturer={l} onOpen={setActive} />
        ))}
      </div>

      <LecturerProfileModal
        lecturer={active}
        open={!!active}
        onClose={() => setActive(null)}
      />
    </section>
  );
}
