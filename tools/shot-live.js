/* 对线上站点截图验证部署:node tools/shot-live.js */
const path = require('path');
const { chromium } = require('playwright-core');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = process.argv[2] || 'https://1132421231z-ops.github.io/dongbei-nongxia';

(async () => {
  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  for (const name of ['index', 'online', 'product', 'service']) {
    await page.goto(BASE + '/' + name + '.html', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      document.querySelectorAll('.fade-up').forEach(el => el.classList.add('in'));
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, '..', 'shots', 'live-' + name + '.png'), fullPage: false });
    console.log('OK', name);
  }
  console.log('JS errors:', errors.length === 0 ? 'NONE' : errors.join(' | '));
  await browser.close();
})();
