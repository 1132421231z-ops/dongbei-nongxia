/* 验证:点击返回顶部无控制台报错 */
const path = require('path');
const { chromium } = require('playwright-core');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

(async () => {
  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  const file = path.join(__dirname, '..', 'index.html');
  await page.goto('file:///' + file.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  // 滚到底,让返回顶部按钮出现
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  // 点击返回顶部
  await page.click('.to-top');
  await page.waitForTimeout(1200);
  const y = await page.evaluate(() => window.scrollY);
  console.log('scrollY after click =', y);
  console.log('console/page errors =', errors.length === 0 ? 'NONE' : errors.join(' | '));
  await browser.close();
  if (errors.length > 0) process.exit(1);
})();
