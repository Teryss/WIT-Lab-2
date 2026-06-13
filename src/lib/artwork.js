// Generates an inline SVG "scan" of a drawing in a given style.
// This keeps the gallery presentable with no external image hosting and
// makes it trivial to swap each <DrawingScan> for a real <img src=...>
// once a CMS / image API is wired up.

const W = 800;
const H = 1000;

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function variantHatching(variant, rng) {
  // Each variant produces a different composition flavour, mimicking
  // student assignments: portrait, still life, perspective, figure.
  const lines = [];
  if (variant === 0) {
    // Portrait silhouette
    const cx = 400,
      cy = 460;
    for (let i = 0; i < 80; i++) {
      const a = (i / 80) * Math.PI * 2;
      const r = 170 + (rng() - 0.5) * 18;
      const x1 = cx + Math.cos(a) * r;
      const y1 = cy + Math.sin(a) * r * 1.25;
      const x2 = cx + Math.cos(a + 0.05) * (r + 12);
      const y2 = cy + Math.sin(a + 0.05) * (r + 12) * 1.25;
      lines.push({ x1, y1, x2, y2, o: 0.35 + rng() * 0.55 });
    }
    // cheek shadow
    for (let i = 0; i < 40; i++) {
      const x = cx + 60 + rng() * 30;
      const y = cy + 40 + rng() * 60;
      lines.push({ x1: x, y1: y, x2: x + 18 + rng() * 12, y2: y - 6, o: 0.2 + rng() * 0.4 });
    }
  } else if (variant === 1) {
    // Still life: vase + fruit on a table
    const tableY = 720;
    // Table top hatching
    for (let x = 0; x < W; x += 8) {
      lines.push({ x1: x, y1: tableY, x2: x + 60, y2: tableY + 30, o: 0.3 });
    }
    // Vase
    const vx = 360;
    for (let y = 420; y < tableY; y += 6) {
      const t = (y - 420) / (tableY - 420);
      const r = 40 + Math.sin(t * Math.PI) * 60;
      lines.push({
        x1: vx - r,
        y1: y,
        x2: vx + r,
        y2: y,
        o: 0.45,
      });
    }
    // Apple
    for (let i = 0; i < 30; i++) {
      const ax = 560 + (rng() - 0.5) * 8;
      const ay = tableY - 30 + (rng() - 0.5) * 8;
      lines.push({
        x1: ax - 30,
        y1: ay,
        x2: ax + 30,
        y2: ay + 4,
        o: 0.3 + rng() * 0.3,
      });
    }
  } else if (variant === 2) {
    // Linear perspective — converging lines to a vanishing point
    const vx = W / 2,
      vy = 320;
    for (let i = 0; i < 30; i++) {
      const x = (i / 30) * W;
      lines.push({ x1: x, y1: 100, x2: vx, y2: vy, o: 0.25 });
      lines.push({ x1: x, y1: H - 100, x2: vx, y2: vy, o: 0.25 });
    }
    // Floor grid
    for (let y = 500; y < H; y += 30) {
      const t = (y - 500) / (H - 500);
      const w = (W / 2) * t;
      lines.push({ x1: vx - w, y1: y, x2: vx + w, y2: y, o: 0.35 });
    }
  } else {
    // Figure: head + torso + limb gesture
    const cx = 380;
    // Head
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI;
      const r = 80 + rng() * 4;
      lines.push({
        x1: cx + Math.cos(a) * r,
        y1: 260 + Math.sin(a) * r,
        x2: cx + Math.cos(a) * (r + 6),
        y2: 260 + Math.sin(a) * (r + 6),
        o: 0.4,
      });
    }
    // Torso hatching
    for (let y = 360; y < 640; y += 7) {
      const w = 100 - (y - 360) * 0.05;
      lines.push({ x1: cx - w, y1: y, x2: cx + w, y2: y + 10, o: 0.35 });
    }
    // Arm gesture
    for (let i = 0; i < 25; i++) {
      const t = i / 25;
      const x = cx + 100 + t * 140;
      const y = 420 + t * 80;
      lines.push({ x1: x, y1: y, x2: x + 10, y2: y + 6, o: 0.4 });
    }
  }
  return lines;
}

export function drawingScanSvg({ variant = 0, seed = 1, label = 'WORK SCAN' } = {}) {
  const rng = seeded(seed * 9973 + 7);
  const lines = variantHatching(variant, rng);
  const stroke = lines
    .map(
      (l) =>
        `<line x1="${l.x1.toFixed(1)}" y1="${l.y1.toFixed(1)}" x2="${l.x2.toFixed(1)}" y2="${l.y2.toFixed(1)}" stroke="#1a1a1a" stroke-width="0.7" stroke-linecap="round" opacity="${l.o.toFixed(2)}"/>`,
    )
    .join('');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="display:block" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="paper-${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7f1e3"/>
      <stop offset="100%" stop-color="#ece4d0"/>
    </linearGradient>
    <pattern id="grain-${seed}" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.5" fill="#000" opacity="0.05"/>
      <circle cx="4" cy="3" r="0.4" fill="#000" opacity="0.04"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#paper-${seed})"/>
  <rect width="${W}" height="${H}" fill="url(#grain-${seed})"/>
  <g>${stroke}</g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="#d4c9aa" stroke-width="1"/>
</svg>`.trim();
}

// Portrait photo placeholder for lecturers — initials on a gradient.
export function portraitSvg({ firstName = '', lastName = '', seed = 1 } = {}) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  const hue1 = (seed * 47) % 360;
  const hue2 = (seed * 89 + 60) % 360;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" role="img" aria-label="${firstName} ${lastName}">
  <defs>
    <linearGradient id="bg-${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue1}, 35%, 30%)"/>
      <stop offset="100%" stop-color="hsl(${hue2}, 45%, 18%)"/>
    </linearGradient>
    <radialGradient id="spot-${seed}" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="400" height="500" fill="url(#bg-${seed})"/>
  <rect width="400" height="500" fill="url(#spot-${seed})"/>
  <text x="200" y="270" text-anchor="middle" font-family="Inter, sans-serif" font-size="120" font-weight="700" fill="rgba(255,255,255,0.92)" letter-spacing="2">${initials}</text>
</svg>`.trim();
}
