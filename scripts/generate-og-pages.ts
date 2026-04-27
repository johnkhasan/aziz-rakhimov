import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const articlesPath = path.join(distDir, 'data', 'articles.json');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(articlesPath) || !fs.existsSync(indexHtmlPath)) {
  console.error('Missing dist files. Make sure to run this after vite build.');
  process.exit(1);
}

const articlesRaw = fs.readFileSync(articlesPath, 'utf-8');
const articles = JSON.parse(articlesRaw);
const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

for (const article of articles) {
  const slug = article.slug;
  const title = article.title;
  // Strip html tags from description and shorten
  let description = article.content.replace(/<[^>]*>?/gm, '').replace(/[#*\[\]`]/g, '').trim().substring(0, 155);
  // Encode quotes to prevent HTML breaking
  description = description.replace(/"/g, '&quot;');
  const safeTitle = title.replace(/"/g, '&quot;');
  
  if (description.length === 155) description += '...';
  
  const ogTags = `
    <title>${safeTitle} | Aziz Rakhimov</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="https://azizrakhimov.uz/pwa-512x512.png" />
    <meta property="og:url" content="https://azizrakhimov.uz/article/${slug}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Aziz Rakhimov" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="https://azizrakhimov.uz/pwa-512x512.png" />
  `;

  // Inject into base HTML before </head>
  // We also remove the generic <title> tag to prevent duplicates, if it exists
  let articleHtml = baseHtml.replace(/<title>.*?<\/title>/, '');
  articleHtml = articleHtml.replace('</head>', `${ogTags}\n</head>`);

  const articleDir = path.join(distDir, 'article', slug);
  fs.mkdirSync(articleDir, { recursive: true });
  fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml);
}

console.log(`Generated OG static index.html pages for ${articles.length} articles!`);
