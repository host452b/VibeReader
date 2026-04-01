#!/usr/bin/env node
/**
 * Capture store assets from assets.html using Puppeteer.
 * All output: 24-bit PNG (no alpha), exact Chrome Web Store dimensions.
 *
 * Usage:  node store-assets/capture.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname);
const HTML = 'file://' + path.join(__dirname, 'assets.html');

const ASSETS = [
  { id: 'store-icon',   file: 'store-icon-128x128.png',   w: 128,  h: 128  },
  { id: 'tile-small',   file: 'promo-small-440x280.png',  w: 440,  h: 280  },
  { id: 'tile-marquee', file: 'promo-marquee-1400x560.png', w: 1400, h: 560 },
  { id: 'ss-chat',      file: 'screenshot-1-chat.png',    w: 1280, h: 800  },
  { id: 'ss-autosum',   file: 'screenshot-2-autosum.png', w: 1280, h: 800  },
  { id: 'ss-raw',       file: 'screenshot-3-raw-editor.png', w: 1280, h: 800 },
  { id: 'ss-tabs',      file: 'screenshot-4-tab-picker.png', w: 1280, h: 800 },
  { id: 'ss-settings',  file: 'screenshot-5-settings.png', w: 1280, h: 800  },
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Large viewport to fit all assets
  await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
  await page.goto(HTML, { waitUntil: 'networkidle0' });

  for (const asset of ASSETS) {
    const el = await page.$('#' + asset.id);
    if (!el) {
      console.error(`  SKIP  #${asset.id} not found`);
      continue;
    }

    const outPath = path.join(OUT, asset.file);

    // Capture with no alpha (omitBackground: false = white background)
    await el.screenshot({
      path: outPath,
      type: 'png',
      omitBackground: false,
    });

    // Verify dimensions
    const { width, height } = await el.boundingBox();
    const ok = Math.round(width) === asset.w && Math.round(height) === asset.h;
    console.log(`  ${ok ? 'OK' : 'WARN'}  ${asset.file}  ${Math.round(width)}x${Math.round(height)}`);
  }

  await browser.close();

  // Strip alpha channel using sips (macOS) to ensure 24-bit PNG
  console.log('\n  Stripping alpha channels...');
  const { execSync } = require('child_process');
  for (const asset of ASSETS) {
    const fp = path.join(OUT, asset.file);
    if (fs.existsSync(fp)) {
      try {
        execSync(`sips -s format png -s formatOptions 0 "${fp}" --out "${fp}" 2>/dev/null`);
      } catch (e) {
        // sips may not support formatOptions on all versions, try alternative
        execSync(`python3 -c "
from PIL import Image
img = Image.open('${fp}').convert('RGB')
img.save('${fp}')
" 2>/dev/null`);
      }
    }
  }

  console.log('\n  Done. Assets saved to store-assets/');
})();
