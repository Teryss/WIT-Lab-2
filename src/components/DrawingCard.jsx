import DrawingScan from './DrawingScan';

export default function DrawingCard({ drawing, onOpen }) {
  const { title, author, technique, semester, supervisor } = drawing;
  return (
    <button
      type="button"
      onClick={() => onOpen?.(drawing)}
      className="text-left bg-white rounded-xl2 border border-neutral-200 shadow-soft hover:shadow-lift transition-shadow overflow-hidden flex flex-col w-full focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      <div className="aspect-[4/5] w-full bg-neutral-100 overflow-hidden">
        <DrawingScan
          drawing={drawing}
          label={title}
          className="w-full h-full block"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-neutral-900 text-base leading-snug">
          {title}
        </h3>
        <p className="text-sm text-neutral-500">
          {author.firstName} {author.lastName}
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="tag-pill">Semester {semester}</span>
          <span className="tag-pill">{technique}</span>
          <span className="tag-pill">{supervisor}</span>
        </div>
      </div>
    </button>
  );
}
