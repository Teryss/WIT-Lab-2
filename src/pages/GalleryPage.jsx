import { useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import { DRAWINGS, LECTURERS } from '../data/lecturers';
import FilterSidebar from '../components/FilterSidebar';
import GalleryGrid from '../components/GalleryGrid';

const INITIAL = {
  query: '',
  semester: 'all',
  instructor: 'all',
  technique: 'all',
};

export default function GalleryPage() {
  const [filters, setFilters] = useState(INITIAL);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return DRAWINGS.filter((d) => {
      if (filters.semester !== 'all' && String(d.semester) !== String(filters.semester))
        return false;
      if (filters.instructor !== 'all' && d.supervisorId !== filters.instructor)
        return false;
      if (filters.technique !== 'all' && d.technique !== filters.technique) return false;
      if (q) {
        const hay =
          `${d.title} ${d.author.firstName} ${d.author.lastName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900">
            Drawing Gallery
          </h1>
          <p className="mt-2 text-neutral-500 max-w-2xl">
            Browse the archive. Use the filters to find works by semester,
            supervisor, or technique.
          </p>
        </div>
        <div className="text-sm text-neutral-500">
          Showing <span className="font-semibold text-neutral-900">{filtered.length}</span>{' '}
          of {DRAWINGS.length}
        </div>
      </div>

      <div className="mt-6 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 shadow-soft"
        >
          <Filter size={16} /> {drawerOpen ? 'Hide filters' : 'Show filters'}
        </button>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px,1fr]">
        <div className={`${drawerOpen ? 'block' : 'hidden'} lg:block`}>
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            lecturers={LECTURERS}
          />
        </div>
        <div>
          <GalleryGrid drawings={filtered} />
        </div>
      </div>
    </section>
  );
}
