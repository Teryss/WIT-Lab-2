import { Link } from 'react-router-dom';
import DrawingCard from '../components/DrawingCard';
import { DRAWINGS } from '../data/lecturers';
import { useState } from 'react';
import DrawingModal from '../components/DrawingModal';

export default function HomePage() {
  const [active, setActive] = useState(null);
  const previews = DRAWINGS.slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="hero-bg text-white">
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-36 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            The Drawing Gallery
            <br className="hidden sm:block" />
            <span className="text-accent-200"> of Akademia WIT</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-neutral-200 max-w-2xl mx-auto">
            A curated archive of student drawings from the Akademia WIT
            workshops. Discover the technical foundation, classical training, and
            creative voice of our Graphics students — semester by semester.
          </p>
          <div className="mt-10">
            <Link to="/gallery" className="btn-pill btn-pill-primary">
              Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Preview cards */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Featured Works
          </h2>
          <p className="mt-2 text-neutral-500 max-w-xl mx-auto">
            A small taste of what is inside the archive. Open the full gallery
            to see everything, filtered by semester, technique, and supervisor.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {previews.map((d) => (
            <DrawingCard key={d.id} drawing={d} onOpen={setActive} />
          ))}
        </div>
      </section>

      <DrawingModal
        drawing={active}
        open={!!active}
        onClose={() => setActive(null)}
      />
    </>
  );
}
