/* Export the poster as a white-on-transparent PNG.
 *
 * invite.html is rendered in one-colour mode (body.mono): ink black on a
 * white ground, with reversed elements — the tagline bar, the FUKU tiles,
 * the date oval — keeping their knockouts. That render is a coverage map,
 * so alpha = 255 − luminance and every pixel is painted pure white.
 *
 *   node tools/export-white.js [outfile] [width]
 *
 * Needs playwright; set CHROMIUM to a browser binary if it can't find one.
 */
const { chromium } = require('playwright');
const path = require('path');
const zlib = require('zlib');
const fs = require('fs');

const OUT = process.argv[2] || path.join(__dirname, '..', 'assets', 'invite-white.png');
const WIDTH = Number(process.argv[3] || 2160);
const PAGE = 'file://' + path.join(__dirname, '..', 'invite.html');

/* ── minimal PNG codec (8-bit, non-interlaced — what Chromium emits) ───── */
let TABLE;
function crc32(buf) {
  if (!TABLE) {
    TABLE = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      TABLE[n] = c;
    }
  }
  let c = -1;
  for (const b of buf) c = TABLE[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function decode(buf) {
  let p = 8, width = 0, height = 0, channels = 0;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8) throw new Error('expected 8-bit PNG');
      channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[data[9]];
      if (!channels) throw new Error('unsupported colour type ' + data[9]);
      if (data[12]) throw new Error('interlaced PNG not supported');
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(stride * height);
  const paeth = (a, b, c) => {
    const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const src = y * (stride + 1) + 1;
    const dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? out[dst + x - channels] : 0;
      const b = y > 0 ? out[dst - stride + x] : 0;
      const c = x >= channels && y > 0 ? out[dst - stride + x - channels] : 0;
      const v = raw[src + x];
      out[dst + x] =
        filter === 0 ? v :
        filter === 1 ? v + a :
        filter === 2 ? v + b :
        filter === 3 ? v + ((a + b) >> 1) :
                       v + paeth(a, b, c);
    }
  }
  return { width, height, channels, data: out };
}

function encodeRGBA(width, height, rgba) {
  const stride = width * 4;
  const rows = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    rows[y * (stride + 1)] = 0;
    rgba.copy(rows, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ── render, then coverage → alpha ─────────────────────────────────────── */
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const page = await browser.newPage({
    viewport: { width: Math.round(WIDTH / 2), height: Math.round(WIDTH / 2 * 1.25) },
    deviceScaleFactor: 2,
  });
  await page.goto(PAGE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.body.classList.add('mono'));
  await page.waitForTimeout(150);
  const shot = await page.locator('.stage').screenshot({ type: 'png' });
  await browser.close();

  const { width, height, channels, data } = decode(shot);
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, n = width * height; i < n; i++) {
    const s = i * channels;
    const lum = channels >= 3
      ? 0.2126 * data[s] + 0.7152 * data[s + 1] + 0.0722 * data[s + 2]
      : data[s];
    const d = i * 4;
    rgba[d] = rgba[d + 1] = rgba[d + 2] = 255;
    rgba[d + 3] = Math.round(255 - lum);
  }
  fs.writeFileSync(OUT, encodeRGBA(width, height, rgba));
  console.log(`${path.relative(process.cwd(), OUT)}  ${width}×${height}`);
})();
