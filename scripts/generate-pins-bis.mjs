import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'assets', 'pins-generated');

const BALL_REF = '/Users/selmene/Downloads/Pawly/Pawly Interactive Ball.webp';
const BOWL_REF = '/Users/selmene/Downloads/Pawly/Pinterest/Pawly Bowl Portable Dog Water Dish.webp';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY missing. Run: node --env-file=.env scripts/generate-pins-bis.mjs');
  process.exit(1);
}

const MODEL = 'gemini-3-pro-image-preview';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const WORDMARK = `Include a small "PAWLY — GOPAWLY.PRO" wordmark at the bottom center of the pin, in Playfair Display serif small caps, dark warm brown (#3D2E1E). Also include the "P" monogram logo (stylized serif P letter with a small terracotta paw print replacing the dot detail) in the top-left corner, small and discreet.`;

async function toInlineData(path) {
  const buf = await readFile(path);
  const ext = path.split('.').pop().toLowerCase();
  const mime = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg';
  return { inline_data: { mime_type: mime, data: buf.toString('base64') } };
}

const prompts = [
  {
    name: '03-catball-lifestyle-bis',
    refs: [BALL_REF],
    prompt: `Use the reference image as the ball product — preserve its bright green spiral-textured design, the clear plastic housing at the base, and its green rope tail. Stylize it into a flat vector illustration but keep it recognizable as the same product.

A flat vector illustration Pinterest pin, 2:3 portrait aspect ratio (1000x1500 pixels). Cream (#FAF7F2) background with subtle paper grain. A minimalist geometric scandi-minimalist living room interior: a ginger cat silhouette mid-pounce towards the Pawly Ball (green spiral ball with green rope tail, stylized but recognizable) rolling on a light oak parquet floor. A simplified sofa in warm tan (#C4956A) in the background, a potted plant, a soft sun ray coming from the side.

Style: flat editorial vector illustration, New Yorker magazine aesthetic, THIN CONFIDENT LINE WORK ONLY — NOT thick children's book outlines. Generous negative space. Flat solid colors, no gradients, no shadows. Warm earth palette (#FAF7F2, #C4956A, #B87333, #3D2E1E) with the green accent of the ball. Aspirational cozy pet lifestyle. No text in main area, leave bottom space clean. ${WORDMARK}`,
  },
  {
    name: '04-catball-testimonial-bis',
    refs: [BALL_REF],
    prompt: `Use the reference image as the ball product — preserve its bright green spiral-textured design and green rope tail. Stylize it into a flat vector illustration but keep it clearly recognizable as the same product.

A minimalist Pinterest pin, 2:3 portrait aspect ratio (1000x1500 pixels). Cream (#FAF7F2) background with subtle paper grain texture.

TOP HALF: a flat vector illustration of a ginger cat with its front paw raised, playfully batting at the Pawly Ball (green spiral ball with visible green rope tail, recognizable as the reference product). Geometric flat style, warm earth tones (#3D2E1E, #C4956A, #B87333) plus the green ball as the focal accent. New Yorker editorial illustration style, thin confident lines.

BOTTOM HALF: a large empty cream panel, completely empty, reserved for later testimonial quote overlay.

A small terracotta (#B87333) paw print accent placed between the two halves as a divider. ${WORDMARK}`,
  },
  {
    name: '06-bowl-comparison-bis',
    refs: [BOWL_REF],
    prompt: `Use the reference image as the Pawly Bowl product — preserve its mint/teal color, the distinctive integrated bowl-and-bottle shape (scoop-shaped bowl on top, clear plastic reservoir at the bottom), the small paw-icon button on the front, and the grey fabric wrist strap. Stylize it into a flat vector illustration but keep it clearly recognizable as the same product.

A flat vector comparison Pinterest pin, 2:3 portrait aspect ratio (1000x1500 pixels). Cream (#FAF7F2) background. Split horizontally with a subtle cream seam down the middle.

LEFT side — the "bad" scenario: a minimalist flat illustration of a generic foldable dog water bowl tipped over on its side with water drops spilling out into a small puddle. Muted brown earth tones. A small terracotta (#B87333) cross mark (×) above indicating this is the wrong option.

RIGHT side — the "good" scenario: a clean flat illustration of the Pawly Bowl (mint/teal color preserved, with its scoop-top, clear reservoir, and grey strap clearly visible), standing upright in its correct orientation, with a neat single water stream indicated flowing from the bottle into the bowl. A small terracotta checkmark (✓) above indicating this is the right choice.

Both sides in matching flat editorial illustration style, thin confident line work. Warm earth palette (#FAF7F2, #C4956A, #B87333, #3D2E1E) plus the preserved mint/teal accent from the Pawly Bowl. No other text. ${WORDMARK}`,
  },
];

async function generate({ name, prompt, refs = [] }) {
  const parts = [{ text: prompt }];
  for (const refPath of refs) {
    parts.push(await toInlineData(refPath));
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ['IMAGE'] },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 400)}`);
  }

  const data = await response.json();
  const respParts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = respParts.find((p) => p.inlineData?.mimeType?.startsWith('image/'));

  if (!imagePart) {
    throw new Error(`No image in response. Raw: ${JSON.stringify(data).slice(0, 400)}`);
  }

  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  const ext = imagePart.inlineData.mimeType.split('/')[1] || 'png';
  const outPath = join(OUTPUT_DIR, `${name}.${ext}`);
  await writeFile(outPath, buffer);
  return { outPath, sizeKB: (buffer.length / 1024).toFixed(0) };
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`Generating ${prompts.length} bis pins with product references via ${MODEL}...\n`);

  for (const p of prompts) {
    process.stdout.write(`→ ${p.name} ... `);
    try {
      const { sizeKB } = await generate(p);
      console.log(`OK (${sizeKB} KB)`);
    } catch (e) {
      console.log(`FAIL`);
      console.error(`  ${e.message}\n`);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log(`\nDone. Output: ${OUTPUT_DIR}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
