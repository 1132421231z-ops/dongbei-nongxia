/* SEO 优化:为 7 个页面统一注入 keywords/Open Graph/Twitter/JSON-LD
 * 域名用 __BASE__ 占位,部署后: node tools/seo.js --set-url https://你的域名/
 * 幂等:已注入则跳过。 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..');
const BASE_KEY = '__BASE__';
// 读命令行 --set-url 参数用于批量替换占位符
const setUrlIdx = process.argv.indexOf('--set-url');
const SET_URL = setUrlIdx > -1 ? process.argv[setUrlIdx + 1] : null;

if (SET_URL) {
  let n = 0;
  for (const f of fs.readdirSync(DIR).filter(x => x.endsWith('.html'))) {
    const p = path.join(DIR, f);
    const html = fs.readFileSync(p, 'utf8');
    if (html.includes(BASE_KEY)) {
      fs.writeFileSync(p, html.split(BASE_KEY).join(SET_URL));
      n++;
    }
  }
  ['robots.txt', 'sitemap.xml'].forEach(f => {
    const p = path.join(DIR, f);
    if (fs.existsSync(p)) {
      const s = fs.readFileSync(p, 'utf8');
      if (s.includes(BASE_KEY)) { fs.writeFileSync(p, s.split(BASE_KEY).join(SET_URL)); n++; }
    }
  });
  console.log('URL 占位符已替换为:', SET_URL, '· 共更新', n, '个文件');
  process.exit(0);
}

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '寒塘鲜虾',
  url: BASE_KEY,
  logo: BASE_KEY + 'assets/logo.png',
  slogan: '冰泉养·鲜弹甜',
  description: '依托寒地小龙虾育种技术,冰泉养·鲜弹甜的即热即食速食小龙虾品牌,线上电商、实体商超、餐饮供货三大渠道全域运营。',
  foundingLocation: '哈尔滨',
  areaServed: '中国',
};

function ld(...objs) {
  // 每个结构化数据对象必须是独立的 <script> 标签,拼接在同一标签内是非法 JSON
  return objs.map(o =>
    '    <script type="application/ld+json">\n' +
    JSON.stringify(o, null, 2).replace(/\n/g, '\n    ') +
    '\n    </script>'
  ).join('\n');
}

const KEYWORDS = {
  index: '寒塘鲜虾,寒地小龙虾,稻田小龙虾,即食小龙虾,哈尔滨小龙虾,速食小龙虾,小龙虾品牌,小龙虾电商',
  online: '寒塘鲜虾线上销售,小龙虾电商,小龙虾小程序,即食小龙虾网购,小龙虾冷链配送,抖音小龙虾,小龙虾送货上门',
  supermarket: '寒塘鲜虾实体店,小龙虾超市,校园小龙虾,自提冷柜,即食小龙虾零售,小龙虾食堂,小龙虾专柜',
  restaurant: '小龙虾B端供应,小龙虾供应链,小龙虾批发,餐饮小龙虾,夜宵小龙虾,预制小龙虾,小龙虾餐饮供货',
  product: '寒地小龙虾,东北小龙虾,稻田小龙虾,即食小龙虾,麻辣小龙虾,蒜蓉小龙虾,十三香小龙虾,贡菜小龙虾,小龙虾礼盒,小龙虾价格',
  cooperation: '小龙虾养殖合作,寒地小龙虾养殖,稻田养虾,小龙虾苗种,小龙虾养殖技术,稻虾共养,小龙虾订单回收',
  service: '小龙虾售后,即食小龙虾保存,小龙虾加热方法,小龙虾退换货,寒塘鲜虾客服',
};

// 每个页面的配置:name(中文名)、img(代表图)、desc(og/tw 描述,缺省取 meta description)
const PAGES = {
  index:        { name: '寒塘鲜虾 · 寒地稻田小龙虾', img: 'assets/hero-banner.jpg' },
  online:       { name: '线上销售 · 寒塘鲜虾', img: 'assets/dish-1.jpg' },
  supermarket:  { name: '实体商超 · 寒塘鲜虾', img: 'assets/giftbox-3d.jpg' },
  restaurant:   { name: '餐饮供货 · 寒塘鲜虾', img: 'assets/base.jpg' },
  product:      { name: '产品介绍 · 寒塘鲜虾', img: 'assets/dish-1.jpg' },
  cooperation:  { name: '养殖合作 · 寒塘鲜虾', img: 'assets/paddy-banner.jpg' },
  service:      { name: '售后服务 · 寒塘鲜虾', img: 'assets/logo.png' },
};

function breadcrumb(name, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '寒塘鲜虾', item: BASE_KEY },
      { '@type': 'ListItem', position: 2, name: name.replace(/^.*?·\s*/, ''), item: url },
    ],
  };
}

// 产品结构化数据(product 页专属)
const PRODUCTS = [
  { name: '经典系列 · 蒜蓉风味 600g', price: '42' },
  { name: '经典系列 · 麻辣风味 600g', price: '42' },
  { name: '经典系列 · 十三香风味 600g', price: '42' },
  { name: '贡菜双脆 · 蒜蓉风味 300g', price: '52' },
  { name: '贡菜双脆 · 麻辣风味 300g', price: '52' },
  { name: '贡菜双脆 · 十三香风味 300g', price: '52' },
  { name: '经典礼盒 1.2kg', price: '99' },
];
const PRODUCT_LIST = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '寒塘鲜虾产品系列',
  itemListElement: PRODUCTS.map((p, i) => ({
    '@type': 'Product',
    name: p.name,
    brand: { '@type': 'Brand', name: '寒塘鲜虾' },
    offers: { '@type': 'Offer', price: p.price, priceCurrency: 'CNY', availability: 'https://schema.org/InStock' },
  })),
};

const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '寒塘鲜虾',
  url: BASE_KEY,
  inLanguage: 'zh-CN',
};

let count = 0;
for (const [name, cfg] of Object.entries(PAGES)) {
  const file = path.join(DIR, name + '.html');
  let html = fs.readFileSync(file, 'utf8');
  // 幂等:先清除旧的注入块,再写入新块(保证可重复执行、结构正确)
  html = html.replace(/<!-- SEO-OPT -->[\s\S]*?\n\s*<\/head>/, '</head>');

  const url = BASE_KEY + name + '.html';
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  const desc = descMatch ? descMatch[1] : cfg.desc || '';

  const blocks = [
    '<meta name="keywords" content="' + KEYWORDS[name] + '">',
    '<meta name="robots" content="index,follow">',
    '<link rel="canonical" href="' + url + '">',
    '<meta property="og:site_name" content="寒塘鲜虾">',
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="zh_CN">',
    '<meta property="og:title" content="' + cfg.name + '">',
    '<meta property="og:description" content="' + desc + '">',
    '<meta property="og:url" content="' + url + '">',
    '<meta property="og:image" content="' + BASE_KEY + cfg.img + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + cfg.name + '">',
    '<meta name="twitter:description" content="' + desc + '">',
  ];

  const jsonld = [ORG];
  if (name === 'index') jsonld.push(WEBSITE);
  else jsonld.push(breadcrumb(cfg.name, url));
  if (name === 'product') jsonld.push(PRODUCT_LIST);

  const seoBlock =
    '  <!-- SEO-OPT -->\n' +
    '  ' + blocks.join('\n  ') + '\n' +
    '  ' + ld(...jsonld) + '\n';

  html = html.replace('</head>', seoBlock + '</head>');
  fs.writeFileSync(file, html);
  count++;
}
console.log('SEO 优化完成 · 更新', count, '个页面(域名占位符 ' + BASE_KEY + ' 待部署后替换)');
