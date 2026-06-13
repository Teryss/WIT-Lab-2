import { useId } from 'react';
import { Search } from 'lucide-react';

export default function FilterSidebar({ filters, onChange, lecturers }) {
  const idQ = useId();
  const idS = useId();
  const idI = useId();
  const idT = useId();

  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <aside className="bg-white border border-neutral-200 rounded-2xl shadow-soft p-5 md:p-6">
      <h2 className="text-accent font-bold text-lg">Filtering</h2>

      <div className="mt-5">
        <label
          htmlFor={idQ}
          className="text-sm font-semibold text-neutral-800"
        >
          Search (Author / Title)
        </label>
        <div className="mt-2 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            id={idQ}
            type="search"
            className="form-control-clean pl-9"
            placeholder="e.g., Study…"
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor={idS}
          className="text-sm font-semibold text-neutral-800"
        >
          Semester
        </label>
        <select
          id={idS}
          className="form-select-clean mt-2"
          value={filters.semester}
          onChange={(e) => update({ semester: e.target.value })}
        >
          <option value="all">All</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              Semester {n}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label
          htmlFor={idI}
          className="text-sm font-semibold text-neutral-800"
        >
          Instructor
        </label>
        <select
          id={idI}
          className="form-select-clean mt-2"
          value={filters.instructor}
          onChange={(e) => update({ instructor: e.target.value })}
        >
          <option value="all">All</option>
          {lecturers.map((l) => (
            <option key={l.id} value={l.id}>
              {l.degree} {l.firstName} {l.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label
          htmlFor={idT}
          className="text-sm font-semibold text-neutral-800"
        >
          Execution Technique
        </label>
        <select
          id={idT}
          className="form-select-clean mt-2"
          value={filters.technique}
          onChange={(e) => update({ technique: e.target.value })}
        >
          <option value="all">All</option>
          {['Pencil', 'Charcoal', 'Ink', 'Graphite', 'Pastel', 'Sepia', 'Mixed Media', 'Conte'].map(
            (t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ),
          )}
        </select>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({ query: '', semester: 'all', instructor: 'all', technique: 'all' })
        }
        className="mt-6 w-full text-sm font-semibold text-neutral-600 hover:text-accent transition-colors"
      >
        Reset filters
      </button>
    </aside>
  );
}
