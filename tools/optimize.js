/* 素材压缩脚本:大图等比缩放 + 有损压缩,PNG 渲染图转 JPEG(无透明需求) */
const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const assets = 'assets';
const out = 'assets';

// [文件名, 最大宽度, 输出格式, 质量]
const jobs = [
  // 大尺寸实拍/渲染图
  ['base.jpg', 1600, 'jpeg', 80],
  ['base-hold.jpg', 1600, 'jpeg', 80],
  ['hero-banner.jpg', 1600, 'jpeg', 82],
  ['paddy-banner.jpg', 1600, 'jpeg', 82],
  ['dish-1.jpg', 1200, 'jpeg', 82],
  ['dish-garlic.jpg', 1200, 'jpeg', 82],
  ['giftbox-3d.jpg', 1200, 'jpeg', 82],
  ['banner-joy.jpg', 1400, 'jpeg', 82],
  ['banner-paddy.jpg', 1400, 'jpeg', 82],
  // 包装盒渲染 PNG → JPEG(无透明)
  ['pack-suanrong.png', 900, 'jpeg', 84],
  ['pack-mala.png', 900, 'jpeg', 84],
  ['pack-shisanxiang.png', 900, 'jpeg', 84],
  ['pack-gongcai-suanrong.png', 900, 'jpeg', 84],
  ['pack-gongcai-mala.png', 900, 'jpeg', 84],
  ['pack-gongcai-shisanxiang.png', 900, 'jpeg', 84],
  ['gift-classic-2.png', 900, 'jpeg', 84],
  ['gift-festival.png', 900, 'jpeg', 84],
  // 小尺寸产品图
  ['flavor-suanrong.jpg', 700, 'jpeg', 82],
  ['flavor-mala.jpg', 700, 'jpeg', 82],
  ['flavor-shisanxiang.jpg', 700, 'jpeg', 82],
  ['gift-classic.jpg', 700, 'jpeg', 82],
  // 保留透明 PNG
  ['logo.png', 320, 'png', null],
  ['xiaobei.png', 480, 'png', null],
  ['mini-1.png', 520, 'png', null],
  ['mini-2.png', 520, 'png', null],
  ['mini-3.png', 520, 'png', null],
  ['mini-4.png', 520, 'png', null],
];

(async () => {
  const results = [];
  for (const [name, width, format, quality] of jobs) {
    const src = path.join(assets, name);
    if (!fs.existsSync(src)) { console.log('SKIP missing:', name); continue; }
    try {
      const img = await Jimp.read(src);
      const scale = width / img.width;
      if (scale < 1) img.resize({ w: width });
      const before = fs.statSync(src).size;
      let dest = src;
      if (format === 'jpeg') {
        dest = src.replace(/\.(png|jpe?g)$/i, '.jpg');
        await img.write(dest, { quality });
      } else {
        await img.write(dest);
      }
      const after = fs.statSync(dest).size;
      results.push(`${name} ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (${format} ${width}px)`);
    } catch (e) {
      results.push(`ERR ${name}: ${e.message}`);
    }
  }
  console.log(results.join('\n'));
  console.log('--- DONE ---');
})();
