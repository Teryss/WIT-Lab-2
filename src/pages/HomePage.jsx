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
            Galeria rysunku
            <br className="hidden sm:block" />
            <span className="text-accent-200">Akademii WIT</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-neutral-200 max-w-2xl mx-auto">
            Zbiór rysunków studentów powstałych podczas zajęć w Akademii WIT.
            Odkryj techniki, przygotowanie oraz
            twórczą indywidualność studentów grafiki — semestr po semestrze.
          </p>
          <div className="mt-10">
            <Link to="/gallery" className="btn-pill btn-pill-primary">
              Galeria
            </Link>
          </div>
        </div>
      </section>

      {/* Preview cards */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Wybrane prace
          </h2>
          <p className="mt-2 text-neutral-500 max-w-xl mx-auto">
            Urywek tego, co znajdziesz w archiwum. Otwórz pełną galerię,
            aby zobaczyć całość z możliwością filtrowania według semestru,
            techniki i prowadzącego.
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
