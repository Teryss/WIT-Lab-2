// Mock data shaped to map cleanly to a future CMS payload.
// Each drawing exposes the exact fields the design doc requires:
// author, technique, semester, academic year, supervisor, title, and a
// "scan" produced locally as an inline SVG so the gallery is presentable
// without a backend or external image hosting.

const TECHNIQUE_LABELS_PL = {
  Pencil: 'Ołówek',
  Charcoal: 'Węgiel',
  Ink: 'Tusz',
  Graphite: 'Grafit',
  Pastel: 'Pastel',
  Sepia: 'Sepia',
  'Mixed Media': 'Technika mieszana',
  Conte: 'Kredka',
};

export const LECTURERS = [
  {
    id: 'lect-malysz',
    firstName: 'Adam',
    lastName: 'Małysz',
    degree: 'Dr',
    position: 'Lecturer — Drawing Workshop',
    bio: 'Lecturer with many years of experience who values traditional craft and spends a lot of time with students in classes. Specialises in classical drawing techniques, anatomy, and life drawing. He runs the Academy\'s flagship drawing workshop and curates the best student works each semester.',
    portfolioUrl: 'https://example.com/adam-malysz',
    tags: ['Art history', 'Outdoor painting', 'Collecting rare drafting supplies'],
  },
  {
    id: 'lect-novak',
    firstName: 'Ewa',
    lastName: 'Nowak',
    degree: 'Dr hab.',
    position: 'Associate Professor — Figure Drawing',
    bio: 'Associate professor focusing on the human figure, gesture, and classical composition. Her studio is known for a strict, supportive workshop that turns confident draftspeople into disciplined artists.',
    portfolioUrl: 'https://example.com/ewa-nowak',
    tags: ['Figure drawing', 'Anatomy', 'Composition'],
  },
  {
    id: 'lect-kaminski',
    firstName: 'Tomasz',
    lastName: 'Kamiński',
    degree: 'Prof. nadzw.',
    position: 'Professor — Perspective & Architecture',
    bio: 'A practising architect and visual artist. Tomasz teaches the perspective and architectural drawing courses, with a focus on clean line work and rigorous spatial construction.',
    portfolioUrl: 'https://example.com/tomasz-kaminski',
    tags: ['Architecture', 'Perspective', 'Linear drafting'],
  },
];

// Stable lecturer lookups so the data layer stays CMS-shaped.
const LECT_LOOKUP = Object.fromEntries(LECTURERS.map((l) => [l.id, l]));

const TITLES = [
  'Study of Hands',
  'Anatomical Self-Portrait',
  'Still Life with Skull',
  'Charcoal Portrait',
  'Linear Perspective Study',
  'Composition with Drapery',
  'Outdoor Sketch — Old Town',
  'Figure in Motion',
  'Studies of Light and Volume',
  'Nature Morte with Bottles',
  'Classical Bust — Plaster Cast',
  'Architectural Perspective',
  'Expressiveness of the Hand',
  'Foreshortening Exercise',
];

const SURNAMES = [
  'Kaczmarek',
  'Wiśniewski',
  'Nowak',
  'Wójcik',
  'Kowalski',
  'Lewandowski',
  'Zieliński',
  'Szymański',
  'Dąbrowska',
  'Lis',
];
const FIRST_NAMES = [
  'Zofia',
  'Michał',
  'Anna',
  'Piotr',
  'Tomasz',
  'Katarzyna',
  'Julia',
  'Bartosz',
  'Maja',
  'Krzysztof',
];
const TECHNIQUES = Object.keys(TECHNIQUE_LABELS_PL);

// Seeded pseudo-random for stable output between reloads.
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260113);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

function buildDrawings() {
  const out = [];
  for (let i = 0; i < 14; i++) {
    const first = pick(FIRST_NAMES);
    const last = pick(SURNAMES);
    const technique = pick(TECHNIQUES);
    const semester = 1 + Math.floor(rand() * 6);
    const year = 2024 + Math.floor(rand() * 3);
    const lecturer = LECTURERS[Math.floor(rand() * LECTURERS.length)];
    const title = TITLES[i % TITLES.length];
    out.push({
      id: `drw-${String(i + 1).padStart(3, '0')}`,
      title,
      author: { firstName: first, lastName: last },
      technique,
      techniqueLabel: TECHNIQUE_LABELS_PL[technique] ?? technique,
      semester,
      academicYear: `${year}/${year + 1}`,
      supervisorId: lecturer.id,
      supervisor: `${lecturer.degree} ${lecturer.lastName}`,
      variant: i % 4,
    });
  }
  return out;
}

export const DRAWINGS = buildDrawings();

export function getLecturerById(id) {
  return LECT_LOOKUP[id];
}
