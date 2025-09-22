// generate_sitemap.js
// Generate sitemap.xml with Image sitemap entries from images_data.json
// Usage: node generate_sitemap.js

const fs = require('fs');
const path = require('path');

// Site base URL (provided by user)
const SITE_URL = 'https://www.loveanddeepspace.online';

const INPUT_JSON = path.join(__dirname, 'images_data.json');
const OUTPUT_XML = path.join(__dirname, 'sitemap.xml');

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlJoin(base, rel) {
  if (!base.endsWith('/')) base += '/';
  return base + rel.replace(/^\/+/, '');
}

function toISO(mod) {
  try {
    if (!mod) return new Date().toISOString();
    const d = new Date(mod);
    if (isNaN(d.getTime())) return new Date().toISOString();
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function safeTitle(name, tags) {
  if (name) {
    const base = path.basename(name, path.extname(name));
    return base;
  }
  if (Array.isArray(tags) && tags.length) return tags.slice(0, 3).join(' ');
  return 'image';
}

function safeCaption(tags) {
  if (Array.isArray(tags) && tags.length) return tags.join(', ');
  return '';
}

function main() {
  if (!fs.existsSync(INPUT_JSON)) {
    console.error('images_data.json not found');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(INPUT_JSON, 'utf8'));
  if (!Array.isArray(data)) {
    console.error('images_data.json format invalid: expected an array');
    process.exit(1);
  }

  const nowISO = new Date().toISOString();

  let xml = '';
  xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
         'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  // 1) Landing page '/'
  xml += '  <url>\n';
  xml += `    <loc>${xmlEscape(urlJoin(SITE_URL, ''))}</loc>\n`;
  xml += `    <lastmod>${xmlEscape(nowISO)}</lastmod>\n`;
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n';

  // 2) Gallery page with all images
  xml += '  <url>\n';
  xml += `    <loc>${xmlEscape(urlJoin(SITE_URL, 'gallery.html'))}</loc>\n`;
  xml += `    <lastmod>${xmlEscape(nowISO)}</lastmod>\n`;
  xml += '    <priority>0.9</priority>\n';
  for (const img of data) {
    const loc = urlJoin(SITE_URL, img.originalSrc || img.thumbnailSrc || '');
    const title = safeTitle(img.name, img.tags);
    const caption = safeCaption(img.tags);
    xml += '    <image:image>\n';
    xml += `      <image:loc>${xmlEscape(loc)}</image:loc>\n`;
    if (title) xml += `      <image:title>${xmlEscape(title)}</image:title>\n`;
    if (caption) xml += `      <image:caption>${xmlEscape(caption)}</image:caption>\n`;
    xml += '    </image:image>\n';
  }
  xml += '  </url>\n';

  // 3) News page
  xml += '  <url>\n';
  xml += `    <loc>${xmlEscape(urlJoin(SITE_URL, 'news.html'))}</loc>\n`;
  xml += `    <lastmod>${xmlEscape(nowISO)}</lastmod>\n`;
  xml += '    <priority>0.6</priority>\n';
  xml += '  </url>\n';

  // 4) Blog page
  xml += '  <url>\n';
  xml += `    <loc>${xmlEscape(urlJoin(SITE_URL, 'blog.html'))}</loc>\n`;
  xml += `    <lastmod>${xmlEscape(nowISO)}</lastmod>\n`;
  xml += '    <priority>0.6</priority>\n';
  xml += '  </url>\n';

  // 5) Individual News & Blog articles under their folders (flat scan)
  const htmlDirs = ['news', 'blog'];
  for (const dir of htmlDirs) {
    const abs = path.join(__dirname, dir);
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      const items = fs.readdirSync(abs);
      for (const file of items) {
        if (file.toLowerCase().endsWith('.html')) {
          xml += '  <url>\n';
          xml += `    <loc>${xmlEscape(urlJoin(SITE_URL, `${dir}/${file}`))}</loc>\n`;
          xml += `    <lastmod>${xmlEscape(nowISO)}</lastmod>\n`;
          xml += '    <priority>0.5</priority>\n';
          xml += '  </url>\n';
        }
      }
    }
  }

  xml += '</urlset>\n';

  fs.writeFileSync(OUTPUT_XML, xml, 'utf8');
  console.log(`Sitemap generated: ${OUTPUT_XML}`);
}

main();
