export default function AboutPage() {
  return (
    <section className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900">
        About the Subject and Workshop
      </h1>

      <div className="mt-10">
        <h2 className="text-accent font-bold text-lg">Profile and Competencies</h2>
        <ul className="mt-4 space-y-3 text-neutral-700 list-disc pl-6">
          <li>
            Classical drawing foundations — line, value, perspective, anatomy.
          </li>
          <li>
            Traditional media: pencil, charcoal, ink, graphite, sepia, pastel.
          </li>
          <li>
            Composition and storytelling through hand-made drawing practice.
          </li>
          <li>
            Workshop critique culture: peer review and individual feedback from
            supervising lecturers.
          </li>
          <li>
            Portfolio preparation: curation, sequencing, and presentation of
            physical work for digital publication.
          </li>
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="text-accent font-bold text-lg">Organizational Information</h2>
        <div className="mt-4 bg-white border border-neutral-200 rounded-2xl shadow-soft p-6 md:p-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-neutral-500">Duration</p>
            <p className="mt-1 text-neutral-900 text-lg">3 years / 6 semesters</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-500">Location</p>
            <p className="mt-1 text-neutral-900 text-lg">
              Akademia WIT, Warsaw — Drawing Studio (Building B, 2nd floor)
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-500">Format</p>
            <p className="mt-1 text-neutral-900 text-lg">
              In-person workshops, weekly studio sessions
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-500">Assessment</p>
            <p className="mt-1 text-neutral-900 text-lg">
              Semester review with the supervising lecturer
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
