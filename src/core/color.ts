/**
 * Colour utilities: hex ⇄ OKLCH conversion, perceptual scale generation
 * and WCAG contrast. Pure functions, no dependencies, runs in browser and Node.
 */

export type Rgb = [number, number, number]; // 0..1, gamma-encoded sRGB
export interface Oklch { l: number; c: number; h: number }

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];
export type ColorScale = Record<ScaleStep, string>;

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isHex(value: string): boolean {
  return HEX_RE.test(value.trim());
}

export function hexToRgb(hex: string): Rgb {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function rgbToHex([r, g, b]: Rgb): string {
  const to = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

export function rgbToOklch(rgb: Rgb): Oklch {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.sqrt(A * A + B * B);
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

function oklchToLinear({ l: L, c, h }: Oklch): Rgb {
  const hr = (h * Math.PI) / 180;
  const A = c * Math.cos(hr);
  const B = c * Math.sin(hr);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -0.0001 && v <= 1.0001);

/** Convert OKLCH to hex, reducing chroma until the colour fits in sRGB. */
export function oklchToHex(color: Oklch): string {
  let c = color.c;
  let lin = oklchToLinear({ ...color, c });
  for (let i = 0; i < 40 && !inGamut(lin); i++) {
    c *= 0.94;
    lin = oklchToLinear({ ...color, c });
  }
  return rgbToHex(lin.map((v) => toGamma(Math.min(1, Math.max(0, v)))) as Rgb);
}

export function hexToOklch(hex: string): Oklch {
  return rgbToOklch(hexToRgb(hex));
}

const LIGHTNESS: Record<ScaleStep, number> = {
  50: 0.975, 100: 0.94, 200: 0.885, 300: 0.81, 400: 0.715, 500: 0.63,
  600: 0.545, 700: 0.47, 800: 0.395, 900: 0.32, 950: 0.24,
};
const CHROMA_FACTOR: Record<ScaleStep, number> = {
  50: 0.12, 100: 0.25, 200: 0.45, 300: 0.7, 400: 0.9, 500: 1,
  600: 1, 700: 0.92, 800: 0.82, 900: 0.7, 950: 0.6,
};

export interface GeneratedScale {
  scale: ColorScale;
  /** The step the exact base colour was snapped into. */
  baseStep: ScaleStep;
}

/**
 * Generate an 11-step perceptual scale (50–950) that keeps the base hue.
 * The exact base colour is placed on the step with the closest lightness,
 * so brand colours are reproduced faithfully.
 */
export function generateScale(baseHex: string, opts: { maxChroma?: number } = {}): GeneratedScale {
  const base = hexToOklch(baseHex);
  const chroma = Math.min(base.c, opts.maxChroma ?? Infinity);
  const hue = base.c < 0.005 ? 250 : base.h;
  const scale = {} as ColorScale;
  let baseStep: ScaleStep = 500;
  let best = Infinity;
  for (const step of SCALE_STEPS) {
    scale[step] = oklchToHex({ l: LIGHTNESS[step], c: chroma * CHROMA_FACTOR[step] * 1.15, h: hue });
    const d = Math.abs(LIGHTNESS[step] - base.l);
    if (d < best) { best = d; baseStep = step; }
  }
  if (opts.maxChroma === undefined) scale[baseStep] = baseHex.toLowerCase();
  return { scale, baseStep };
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two colours (1–21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Pick whichever of the candidates has the highest contrast against `bg`. */
export function bestContrast(bg: string, candidates: string[]): string {
  return candidates.reduce((best, c) => (contrastRatio(bg, c) > contrastRatio(bg, best) ? c : best));
}

export function stepOffset(step: ScaleStep, offset: number): ScaleStep {
  const i = SCALE_STEPS.indexOf(step);
  return SCALE_STEPS[Math.min(SCALE_STEPS.length - 1, Math.max(0, i + offset))];
}
