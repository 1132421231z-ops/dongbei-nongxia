/* 单页重截:node tools/shot-one.js cooperation */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const name = process.argv[2] || 'cooperation';
const OUT = path.join(__dirname, '..', 'shots');

(async () => {
  const browser = await chromium.launch({ executablePath: EDGE, headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const file = path.join(__dirname, '..', name + '.html');
  const url = 'file:///' + file.replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('in'));
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
  await page.screenshot({ path: path.join(OUT, name + '-top.png') });
  await browser.close();
  console.log('OK', name);
})();
