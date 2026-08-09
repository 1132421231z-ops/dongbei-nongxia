/* 页面截图:桌面视口 + 全页长图 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const OUT = path.join(__dirname, '..', 'shots');
const PAGES = ['index', 'online', 'supermarket', 'restaurant', 'product', 'cooperation', 'service'];

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (const name of PAGES) {
    const file = path.join(__dirname, '..', name + '.html');
    const url = 'file:///' + file.replace(/\\/g, '/');
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    // 强制显现所有滚动元素并禁用过渡,保证整页截图内容完整
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y <= h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 12)); }
      window.scrollTo(0, 0);
      const st = document.createElement('style');
      st.textContent = '.fade-up{opacity:1!important;transform:none!important;transition:none!important}';
      document.head.appendChild(st);
      document.querySelectorAll('.fade-up').forEach(el => el.classList.add('in'));
    });
    await page.waitForTimeout(200);

    await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
    await page.screenshot({ path: path.join(OUT, name + '-top.png') });
    console.log('OK', name);
  }

  await browser.close();
  console.log('--- ALL DONE ---');
})();
