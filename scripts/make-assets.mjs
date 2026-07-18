// EagleMate — ikon & açılış ekranı üreteci (Faz 7)
// SVG'den sharp ile PNG kaynak görselleri üretir; sonra
// `npx @capacitor/assets generate` bunları tüm yoğunluklara dağıtır.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'assets')
fs.mkdirSync(OUT, { recursive: true })

const CYAN = '#22D3EE'
const TEAL = '#34D399'
const BG_TOP = '#141C30'
const BG_BOT = '#0B1120'

// Kartal amblemi (spread eagle) — 1024 kutuda, x=512 ekseninde simetrik.
// fill: gövde rengi (gradient id ya da düz renk)
function eagle(fill) {
  // Sol yarı; sağ yarı ayna (scale(-1,1)) ile üretilir.
  const half = `
    <path d="
      M512,300
      C470,300 452,332 452,360
      C388,322 300,300 168,300
      C214,330 236,350 250,368
      C214,364 190,362 156,368
      C210,398 250,410 286,420
      C250,424 226,426 196,436
      C258,468 316,480 372,486
      C420,492 452,500 452,520
      L512,520 Z" fill="${fill}"/>
    <path d="M512,352 C556,378 566,438 540,520 L512,520 Z" fill="${fill}"/>
  `
  return `
    <g>
      ${half}
      <g transform="translate(1024,0) scale(-1,1)">${half}</g>
      <circle cx="512" cy="286" r="60" fill="${fill}"/>
      <path d="M512,300 L556,330 L512,372 L468,330 Z" fill="${BG_BOT}" opacity="0.85"/>
      <path d="M488,312 L536,312 L512,352 Z" fill="${fill}"/>
      <path d="M472,520 L552,520 L560,640 L534,596 L512,660 L490,596 L464,640 Z" fill="${fill}"/>
    </g>`
}

const defs = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${BG_TOP}"/>
      <stop offset="1" stop-color="${BG_BOT}"/>
    </linearGradient>
    <linearGradient id="bird" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${CYAN}"/>
      <stop offset="1" stop-color="${TEAL}"/>
    </linearGradient>
  </defs>`

// Adaptive önyüz (şeffaf, güvenli bölge için kartal ~%64): 1024
function iconForegroundSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${defs}
    <g transform="translate(512,512) scale(0.64) translate(-512,-512)">${eagle('url(#bird)')}</g>
  </svg>`
}

// Adaptive arka plan: dolu gradient 1024
function iconBackgroundSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="url(#bg)"/>${defs}</svg>`
}

// Legacy/tam ikon: yuvarlatılmış kare bg + kartal (daha büyük)
function iconOnlySvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${defs}
    <rect width="1024" height="1024" rx="205" fill="url(#bg)"/>
    <g transform="translate(512,516) scale(0.78) translate(-512,-512)">${eagle('url(#bird)')}</g>
  </svg>`
}

// Açılış ekranı: dark bg + ortada kartal + ince cyan çizgi
function splashSvg(dark) {
  const bg = dark ? BG_BOT : BG_BOT
  return `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732">
    ${defs}
    <rect width="2732" height="2732" fill="${bg}"/>
    <g transform="translate(1366,1230) scale(1.05) translate(-512,-512)">${eagle('url(#bird)')}</g>
    <rect x="1146" y="1720" width="440" height="6" rx="3" fill="${CYAN}" opacity="0.9"/>
  </svg>`
}

async function render(svg, file) {
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, file))
  console.log('✓', file)
}

await render(iconForegroundSvg(), 'icon-foreground.png')
await render(iconBackgroundSvg(), 'icon-background.png')
await render(iconOnlySvg(), 'icon-only.png')
await render(splashSvg(false), 'splash.png')
await render(splashSvg(true), 'splash-dark.png')
console.log('Bitti → assets/. Şimdi: npx @capacitor/assets generate --android')
