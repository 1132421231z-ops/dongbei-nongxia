/* 用 Jimp 批量移除产品图纯色背景（灰/黑→透明PNG） */
const fs = require('fs');
const path = require('path');
const { Jimp, intToRGBA, rgbaToInt } = require('jimp');

const ASSETS = path.join(__dirname, '..', 'assets');

const IMAGES = [
  'pack-suanrong.jpg',
  'pack-mala.jpg',
  'pack-shisanxiang.jpg',
  'pack-gongcai-suanrong.jpg',
  'pack-gongcai-mala.jpg',
  'pack-gongcai-shisanxiang.jpg',
  'gift-classic.jpg',
  'gift-classic-2.jpg',
  'giftbox-3d.jpg',
];

// 颜色距离
function colorDist(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

async function processOne(filename) {
  const inputPath = path.join(ASSETS, filename);
  const outputPath = path.join(ASSETS, filename.replace(/\.jpg$/i, '.png'));

  if (!fs.existsSync(inputPath)) {
    console.log('SKIP (not found):', filename);
    return;
  }

  console.log('Processing:', filename);
  const image = await Jimp.read(inputPath);

  const w = image.bitmap.width;
  const h = image.bitmap.height;

  // 从四角采样确定背景色
  const corners = [
    [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)]
  ];

  let avgR = 0, avgG = 0, avgB = 0;
  corners.forEach(([x, y]) => {
    const c = intToRGBA(image.getPixelColor(x, y));
    avgR += c.r; avgG += c.g; avgB += c.b;
  });
  avgR = Math.round(avgR / corners.length);
  avgG = Math.round(avgG / corners.length);
  avgB = Math.round(avgB / corners.length);

  console.log(`  Background color: rgb(${avgR},${avgG},${avgB})`);

  // 计算阈值：用四角颜色的标准差 × 2.5
  let varSum = 0;
  corners.forEach(([x, y]) => {
    const c = intToRGBA(image.getPixelColor(x, y));
    varSum += colorDist(c.r, c.g, c.b, avgR, avgG, avgB);
  });
  const threshold = Math.max(45, Math.min(110, (varSum / corners.length) * 3.2));
  console.log(`  Threshold: ${threshold.toFixed(1)}`);

  // 逐像素处理
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = intToRGBA(image.getPixelColor(x, y));
      const dist = colorDist(c.r, c.g, c.b, avgR, avgG, avgB);

      if (dist < threshold) {
        // 背景区域 → 透明
        const alpha = Math.max(0, Math.min(255, Math.round((dist / threshold) * 255)));
        image.setPixelColor(rgbaToInt(c.r, c.g, c.b, alpha), x, y);
      }
    }
  }

  await image.write(outputPath);
  console.log('  ->', path.basename(outputPath));
}

(async () => {
  console.log('=== Jimp 纯色背景移除 ===\n');
  for (const img of IMAGES) {
    try {
      await processOne(img);
    } catch (err) {
      console.error('FAILED:', img, err.message);
    }
  }
  console.log('\n=== 完成 ===');
})();
