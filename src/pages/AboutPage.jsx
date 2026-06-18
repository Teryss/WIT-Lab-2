export default function AboutPage() {
  return (
    <section className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900">
        O przedmiocie i pracowni
      </h1>

      <div className="mt-10">
        <h2 className="text-accent font-bold text-lg">Profil i kompetencje</h2>
        <ul className="mt-4 space-y-3 text-neutral-700 list-disc pl-6">
          <li>
            Podstawy rysunku klasycznego — linia, walor, perspektywa, anatomia.
          </li>
          <li>
            Tradycyjne media: ołówek, węgiel, tusz, grafit, sepia, pastel.
          </li>
          <li>
            Kompozycja i opowiadanie historii poprzez praktykę rysunku manualnego.
          </li>
          <li>
            Kultura krytyki w pracowni: przeglądy grupowe oraz indywidualne
            konsultacje z prowadzącymi.
          </li>
          <li>
            Przygotowanie portfolio: selekcja, układ i prezentacja prac fizycznych
            do publikacji cyfrowej.
          </li>
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="text-accent font-bold text-lg">Informacje organizacyjne</h2>
        <div className="mt-4 bg-white border border-neutral-200 rounded-2xl shadow-soft p-6 md:p-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-neutral-500">Czas trwania</p>
            <p className="mt-1 text-neutral-900 text-lg">3 lata / 6 semestrów</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-500">Lokalizacja</p>
            <p className="mt-1 text-neutral-900 text-lg">
              Akademia WIT, Warszawa — pracownia rysunku (budynek B, 2. piętro)
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-500">Forma zajęć</p>
            <p className="mt-1 text-neutral-900 text-lg">
              Zajęcia stacjonarne, cotygodniowe sesje w pracowni
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-500">Zaliczenie</p>
            <p className="mt-1 text-neutral-900 text-lg">
              Przegląd semestralny z prowadzącym
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
