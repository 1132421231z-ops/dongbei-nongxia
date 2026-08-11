/* 批量移除产品图背景 */
const fs = require('fs');
const path = require('path');
const { removeBackground } = require('@imgly/background-removal');

const ASSETS = path.join(__dirname, '..', 'assets');

// 需要处理的图片（输出为同名 PNG）
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

async function processOne(filename) {
  const inputPath = path.join(ASSETS, filename);
  const outputPath = path.join(ASSETS, filename.replace(/\.jpg$/i, '.png'));

  if (!fs.existsSync(inputPath)) {
    console.log('SKIP (not found):', filename);
    return;
  }

  console.log('Processing:', filename);
  const imageBuffer = fs.readFileSync(inputPath);
  const blob = await removeBackground(imageBuffer, {
    output: { format: 'image/png' }
  });
  const buffer = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  console.log('  ->', path.basename(outputPath));
}

(async () => {
  console.log('=== 批量移除背景 ===\n');
  for (const img of IMAGES) {
    try {
      await processOne(img);
    } catch (err) {
      console.error('FAILED:', img, err.message);
    }
  }
  console.log('\n=== 完成 ===');
})();
