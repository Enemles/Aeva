import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'assets', 'pins-generated');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY missing. Run: node --env-file=.env scripts/generate-pins.mjs');
  process.exit(1);
}

const MODEL = 'gemini-3-pro-image-preview';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const WORDMARK = `Include a small "PAWLY — GOPAWLY.PRO" wordmark at the bottom center of the pin, in Playfair Display serif small caps, dark warm brown (#3D2E1E). Also include the "P" monogram logo (stylized serif P letter with a small terracotta paw print replacing the dot detail) in the top-left corner, small and discreet.`;

const prompts = [
  {
    name: '01-catball-hook',
    prompt: `A flat vector illustration Pinterest pin, 2:3 portrait aspect ratio (1000x1500 pixels). Full cream background (#FAF7F2) with subtle warm paper grain texture. A minimalist geometric illustration of a ginger cat silhouette sitting on a windowsill, looking outside through a stylized window frame with abstract sun rays in terracotta (#B87333). Warm earth palette throughout: dark warm brown (#3D2E1E), tan (#C4956A), terracotta (#B87333), cream (#FAF7F2). Slightly melancholic mood but stylized and editorial, NOT photo-realistic. New Yorker magazine flat illustration style. Flat solid colors only, no gradients, no shadows, clean geometric shapes. No text in the center of the pin — leave the bottom third empty cream space for later text overlay. ${WORDMARK}`,
  },
  {
    name: '02-catball-specs',
    prompt: `A flat minimalist infographic Pinterest pin, 2:3 portrait aspect ratio (1000x1500 pixels). Full cream background (#FAF7F2) with subtle paper texture. Three horizontal rows stacked vertically in the middle of the pin, each containing a clean geometric icon on the left in terracotta (#B87333). Icons from top to bottom: (1) a lightning bolt, (2) a stopwatch/timer, (3) a USB-C plug. All three icons in the same flat minimal vector style, warm and clean, aligned left. The right side of each row is left empty cream space for later text overlay. Warm earth palette: #FAF7F2 cream, #B87333 terracotta, #3D2E1E dark brown. No other text in the pin yet. ${WORDMARK}`,
  },
  {
    name: '03-catball-lifestyle',
    prompt: `A flat vector illustration Pinterest pin, 2:3 portrait aspect ratio (1000x1500 pixels). Full cream background (#FAF7F2). A minimalist geometric scene showing a stylized scandi-minimalist living room interior: a ginger cat silhouette mid-pounce towards a small round ball on a light oak parquet floor, a simplified sofa in warm tan (#C4956A) in the background, a potted plant, a sun ray coming from the side. Warm earth palette throughout (#FAF7F2, #C4956A, #B87333, #3D2E1E). Flat colors, no gradients, confident minimal line work, New Yorker magazine illustration style. Aspirational cozy pet lifestyle aesthetic. No text in the main area, leave some empty cream space at the bottom for later overlay. ${WORDMARK}`,
  },
  {
    name: '04-catball-testimonial',
    prompt: `A minimalist Pinterest pin 2:3 portrait (1000x1500 pixels). Cream (#FAF7F2) background with subtle paper grain texture. TOP HALF of the pin: a flat vector illustration of a ginger cat silhouette with its paw raised, playfully batting at a small round ball, geometric flat style in warm earth tones (#3D2E1E dark brown, #C4956A tan, #B87333 terracotta). BOTTOM HALF: a large empty cream panel reserved for a testimonial text quote overlay (leave completely empty, just cream). A small terracotta paw print accent between the two halves. ${WORDMARK}`,
  },
  {
    name: '05-bowl-hook',
    prompt: `A flat vector illustration Pinterest pin, 2:3 portrait aspect ratio (1000x1500 pixels). Full cream background (#FAF7F2) with subtle paper texture. A minimalist geometric scene: a stylized human figure (only silhouette, no facial details) hiking a forest trail with a medium-sized dog silhouette walking beside them. Both figures shown from behind, walking into the distance. Abstract simplified trees in varying terracotta and tan tones (#C4956A, #B87333) frame the scene. A subtle mountain shape in the far background. Warm earth palette throughout. Flat colors, no gradients, confident minimal line work, New Yorker magazine editorial illustration style. No text. Leave generous empty cream space at the bottom third for later text overlay. ${WORDMARK}`,
  },
  {
    name: '06-bowl-comparison',
    prompt: `A flat vector comparison Pinterest pin, 2:3 portrait aspect ratio (1000x1500 pixels). Cream (#FAF7F2) background. Split horizontally with a subtle cream seam. LEFT side: a minimalist flat icon of a traditional foldable dog water bowl tipped over with three water drops spilling out, rendered in muted brown tones. A small terracotta (#B87333) cross mark overlays it, indicating "bad". RIGHT side: a clean flat icon of a modern portable dog water bottle-bowl design (bottle with integrated bowl on top) with a neat single water stream flowing into it properly, rendered in the same warm palette. A small terracotta checkmark indicates "good". Both icons in the same flat editorial illustration style, warm earth tones throughout (#FAF7F2, #C4956A, #B87333, #3D2E1E). No other text yet. ${WORDMARK}`,
  },
  {
    name: '07-bowl-flatlay-kit',
    prompt: `A flat-lay illustrated Pinterest pin, 2:3 portrait aspect ratio (1000x1500 pixels). Cream (#FAF7F2) background with warm natural paper texture. Top-down overhead view of hiking essentials arranged on a neutral warm linen surface: a pair of worn brown hiking boots in the top-left, a coiled leather leash below them, a portable dog water bottle-bowl (simplified geometric shape) centered, a folded topographic map in the top-right with small terracotta contour lines, a sprig of pine or eucalyptus in the bottom-left, and a small thermos in the bottom-right. All items rendered as flat minimalist vector illustrations in warm earth tones (#3D2E1E dark brown, #C4956A tan, #B87333 terracotta). Aspirational outdoor minimalism, editorial flat-lay aesthetic, no photography. No text. ${WORDMARK}`,
  },
  {
    name: '08-bowl-testimonial',
    prompt: `A minimalist Pinterest pin 2:3 portrait (1000x1500 pixels). Cream (#FAF7F2) background with subtle paper grain texture. TOP HALF of the pin: a flat vector illustration of a medium-sized dog silhouette (retriever or border collie shape) drinking water from a simplified portable water bottle-bowl, flat geometric style in warm earth tones (#3D2E1E dark brown, #C4956A tan, #B87333 terracotta). BOTTOM HALF: a large empty cream panel reserved for a testimonial text quote overlay (leave completely empty, just cream with subtle texture). A small terracotta paw print accent between the two halves. ${WORDMARK}`,
  },
];

async function generate(name, prompt) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 400)}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'));

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
  console.log(`Generating ${prompts.length} pins via ${MODEL}...\n`);

  const results = [];
  for (const { name, prompt } of prompts) {
    process.stdout.write(`→ ${name} ... `);
    try {
      const { outPath, sizeKB } = await generate(name, prompt);
      console.log(`OK (${sizeKB} KB)`);
      results.push({ name, status: 'ok', outPath });
    } catch (e) {
      console.log(`FAIL`);
      console.error(`  ${e.message}\n`);
      results.push({ name, status: 'fail', error: e.message });
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  const ok = results.filter((r) => r.status === 'ok').length;
  console.log(`\nDone: ${ok}/${results.length} succeeded. Output: ${OUTPUT_DIR}`);
  if (ok < results.length) process.exit(1);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
