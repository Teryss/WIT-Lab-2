import { chromium } from 'playwright';

const log = (...args) => console.log(...args);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  log('STEP 1: navigate to /gallery');
  await page.goto('http://localhost:5173/gallery', { waitUntil: 'networkidle' });
  await sleep(500);

  log('STEP 2: click the first card to open the detail modal');
  // The first card should be a button or link inside the gallery grid.
  // We pick the first <article> or clickable card.
  const firstCard = page.locator('button, a, [role="button"]').filter({
    has: page.locator('img'),
  }).first();
  // Fallback: just look for the first article / card-like element.
  let card = firstCard;
  if ((await firstCard.count()) === 0) {
    card = page.locator('article, [class*="card"]').first();
  }
  // Try multiple strategies for opening the modal.
  const candidates = [
    page.locator('[data-testid="drawing-card"]').first(),
    page.locator('article button').first(),
    page.locator('article').first(),
    page.locator('main >> div >> div').first(),
  ];
  let opened = false;
  for (const c of candidates) {
    if ((await c.count()) > 0) {
      try {
        await c.scrollIntoViewIfNeeded();
        await c.click({ timeout: 2000 });
        await sleep(400);
        // detect modal open
        const modalVisible = await page.locator('[role="dialog"]').isVisible().catch(() => false);
        if (modalVisible) {
          log(`  opened modal with: ${c.toString().slice(0, 80)}`);
          opened = true;
          break;
        }
      } catch {}
    }
  }
  if (!opened) {
    // Last-ditch: click first <img> in the gallery section.
    const img = page.locator('main img').first();
    if ((await img.count()) > 0) {
      await img.click();
      await sleep(400);
    }
  }

  await sleep(300);
  // Wait for the viewer surface to be in the DOM.
  const viewerSurface = page.locator('div[role="img"]').first();
  await viewerSurface.waitFor({ state: 'visible', timeout: 5000 });
  const innerViewer = page.locator('div[role="img"] > div').first();

  log('STEP 3: read inner viewer transform (should be translate(0,0) scale(1) rotate(0))');
  const initialTransform = await innerViewer.evaluate((el) => el.style.transform);
  log(`  transform = "${initialTransform}"`);

  log('STEP 4: read cursor CSS on viewer surface (should be grab)');
  const initialCursor = await viewerSurface.evaluate((el) => getComputedStyle(el).cursor);
  log(`  cursor    = "${initialCursor}"`);

  // Locate center of the viewer surface.
  const box = await viewerSurface.boundingBox();
  const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  log(`  viewer center = (${center.x.toFixed(1)}, ${center.y.toFixed(1)})`);

  log('STEP 5: drag at 1x — move(+80, +40)');
  await page.mouse.move(center.x, center.y);
  await page.mouse.down();
  await page.mouse.move(center.x + 80, center.y + 40, { steps: 10 });
  await page.mouse.up();
  await sleep(250);

  log('STEP 6: re-read transform — x,y MUST have changed');
  const afterDrag1 = await innerViewer.evaluate((el) => el.style.transform);
  log(`  transform = "${afterDrag1}"`);

  // Parse for x and y
  const m1 = afterDrag1.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([-\d.]+)\)\s*rotate\(([-\d.]+)deg\)/);
  if (m1) {
    log(`  parsed x=${m1[1]} y=${m1[2]} scale=${m1[3]} rot=${m1[4]}`);
  } else {
    log('  PARSE FAILED for after-drag transform');
  }

  log('STEP 7: click the reset button — should snap back to 0,0');
  // Reset button has aria-label "Reset view".
  const resetBtn = page.getByRole('button', { name: /reset view/i });
  await resetBtn.click();
  await sleep(250);
  const afterReset = await innerViewer.evaluate((el) => el.style.transform);
  log(`  transform = "${afterReset}"`);

  log('STEP 8: zoom in twice, then drag (center → +60, -30)');
  const zoomInBtn = page.getByRole('button', { name: /zoom in/i });
  await zoomInBtn.click();
  await sleep(150);
  await zoomInBtn.click();
  await sleep(200);
  const afterZoom = await innerViewer.evaluate((el) => el.style.transform);
  log(`  transform after 2x zoom = "${afterZoom}"`);

  // Re-locate the box in case layout shifted.
  const box2 = await viewerSurface.boundingBox();
  const c2 = { x: box2.x + box2.width / 2, y: box2.y + box2.height / 2 };
  await page.mouse.move(c2.x, c2.y);
  await page.mouse.down();
  await page.mouse.move(c2.x + 60, c2.y - 30, { steps: 10 });
  await page.mouse.up();
  await sleep(250);
  const afterZoomDrag = await innerViewer.evaluate((el) => el.style.transform);
  log(`  transform after zoomed drag = "${afterZoomDrag}"`);
  const m2 = afterZoomDrag.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([-\d.]+)\)\s*rotate\(([-\d.]+)deg\)/);
  if (m2) {
    log(`  parsed x=${m2[1]} y=${m2[2]} scale=${m2[3]} rot=${m2[4]}`);
  } else {
    log('  PARSE FAILED for zoomed-drag transform');
  }

  log('STEP 9: summary');
  log('---');
  log(`initial transform : ${initialTransform}`);
  log(`initial cursor    : ${initialCursor}`);
  log(`after 1x drag     : ${afterDrag1}`);
  log(`after reset       : ${afterReset}`);
  log(`after 2x zoom     : ${afterZoom}`);
  log(`after zoomed drag : ${afterZoomDrag}`);

  await browser.close();
})().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
