/* eslint-env node */
/* global Buffer, __dirname */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    for (let j = 0; j < 8; j++) {
      if ((crc ^ byte) & 1) {
        crc = (crc >>> 1) ^ 0xedb88320;
      } else {
        crc = crc >>> 1;
      }
      byte >>>= 1;
    }
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function processImage() {
  const srcPath =
    '/home/conor/.gemini/antigravity-cli/brain/1ee2200e-3ef1-4bda-a88e-f0c0abc8d86b/.user_uploaded/uploaded_media_0_1786977966023.png';
  const srcBuf = fs.readFileSync(srcPath);

  let pos = 8;
  const idatChunks = [];
  while (pos < srcBuf.length) {
    const len = srcBuf.readUInt32BE(pos);
    const type = srcBuf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IDAT') {
      idatChunks.push(srcBuf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }

  const uncompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  const width = 512;
  const height = 512;
  const bpp = 4;
  const rowSize = 1 + width * bpp;

  // Defilter all scanlines to raw RGBA
  const rawRgba = Buffer.alloc(width * height * 4);

  function paethPredictor(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  for (let y = 0; y < height; y++) {
    const filterType = uncompressed[y * rowSize];
    const srcRowOffset = y * rowSize + 1;
    const dstRowOffset = y * width * 4;
    const prevDstRowOffset = (y - 1) * width * 4;

    for (let x = 0; x < width * 4; x++) {
      const rawByte = uncompressed[srcRowOffset + x];
      const a = x >= 4 ? rawRgba[dstRowOffset + x - 4] : 0;
      const b = y > 0 ? rawRgba[prevDstRowOffset + x] : 0;
      const c = y > 0 && x >= 4 ? rawRgba[prevDstRowOffset + x - 4] : 0;

      let val = 0;
      if (filterType === 0) val = rawByte;
      else if (filterType === 1) val = (rawByte + a) & 0xff;
      else if (filterType === 2) val = (rawByte + b) & 0xff;
      else if (filterType === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
      else if (filterType === 4) val = (rawByte + paethPredictor(a, b, c)) & 0xff;

      rawRgba[dstRowOffset + x] = val;
    }
  }

  const themes = [
    {
      name: 'marker_high.png',
      // Red: main coral #F85A65 (248, 90, 101), inner #D63447 (214, 52, 71)
      main: [248, 90, 101],
      inner: [214, 52, 71],
    },
    {
      name: 'marker_medium.png',
      // Amber: main #FF9F0A (255, 159, 10), inner #D97706 (217, 119, 6)
      main: [255, 159, 10],
      inner: [217, 119, 6],
    },
    {
      name: 'marker_low.png',
      // Teal: main #008B8B (0, 139, 139), inner #006767 (0, 103, 103)
      main: [0, 139, 139],
      inner: [0, 103, 103],
    },
  ];

  for (const theme of themes) {
    const outRows = Buffer.alloc(height * rowSize);

    for (let y = 0; y < height; y++) {
      outRows[y * rowSize] = 0; // Filter None
      const dstRow = y * rowSize + 1;
      const srcRow = y * width * 4;

      for (let px = 0; px < width; px++) {
        const i = srcRow + px * 4;
        const o = dstRow + px * 4;
        const r = rawRgba[i];
        const g = rawRgba[i + 1];
        const b = rawRgba[i + 2];
        const a = rawRgba[i + 3];

        if (a === 0) {
          outRows[o] = 0;
          outRows[o + 1] = 0;
          outRows[o + 2] = 0;
          outRows[o + 3] = 0;
        } else {
          // Check if this pixel is in the darker center circle vs the outer body
          // In original image: outer red is ~248, inner circle is ~200-220
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          const isInner = brightness < 125;

          const chosen = isInner ? theme.inner : theme.main;
          outRows[o] = chosen[0];
          outRows[o + 1] = chosen[1];
          outRows[o + 2] = chosen[2];
          outRows[o + 3] = a;
        }
      }
    }

    const compressed = zlib.deflateSync(outRows);

    // Build PNG file
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // color type RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    const finalBuf = Buffer.concat([
      sig,
      makeChunk('IHDR', ihdr),
      makeChunk('IDAT', compressed),
      makeChunk('IEND', Buffer.alloc(0)),
    ]);

    const outPath = path.join(__dirname, '..', 'assets', theme.name);
    fs.writeFileSync(outPath, finalBuf);
    console.log('Saved', outPath, 'size:', finalBuf.length);
  }
}

processImage();
