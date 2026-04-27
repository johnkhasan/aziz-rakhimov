import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import slugify from 'slugify';

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
}).use(markdownItAnchor, {
  level: [2, 3, 4],
  slugify: (s) => slugify(s, { lower: true, strict: true, locale: 'uz' }),
  permalink: markdownItAnchor.permalink.linkInsideHeader({
    symbol: '#',
    placement: 'after',
    class: 'header-anchor text-slate-300 hover:text-emerald-500 dark:text-slate-600 dark:hover:text-emerald-400 no-underline ml-2 opacity-0 transition-opacity',
  }),
});

const VAULT_DIR = path.resolve(process.cwd(), 'aziz-rahimov-blog-main');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public/data');

// Ensure public/data exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  html: string;
  outgoingLinks: string[]; // Slugs of outgoing links
  backlinks: string[]; // Slugs of incoming links
}

const articles: Article[] = [];
const slugToArticleMap = new Map<string, Article>();

// Get all markdown files
const files = globSync('**/*.md', { cwd: VAULT_DIR });

files.forEach(file => {
  // Skip root files like README.md, CLAUDE.md etc or files in .obsidian
  if (file === 'README.md' || file === 'CLAUDE.md' || file.startsWith('.obsidian')) {
    return;
  }

  const absolutePath = path.join(VAULT_DIR, file);
  const rawContent = fs.readFileSync(absolutePath, 'utf-8');
  
  // Parse frontmatter
  const { data, content } = matter(rawContent);
  
  const parsedPath = path.parse(file);
  const title = parsedPath.name;
  
  // If title has tags like #tag, clean it (optional)
  // title = title.replace(/#\S+/g, '').trim();

  // Folder is the category. E.g., '01 - Shaxsiy Rivojlanish' -> 'Shaxsiy Rivojlanish'
  let category = path.dirname(file);
  if (category === '.') category = 'Uncategorized';
  else {
    // Remove leading numbers "01 - "
    category = category.replace(/^\d+\s*-\s*/, '');
  }

  const slug = slugify(title, { lower: true, strict: false, locale: 'uz' });
  
  // Find outgoing wikilinks: [[Link Name]]
  const wikilinkRegex = /\[\[(.*?)\]\]/g;
  const outgoingLinksRaw: string[] = [];
  let match;
  while ((match = wikilinkRegex.exec(content)) !== null) {
    let linkTarget = match[1];
    // Split by | if aliases are used e.g. [[Link|Alias]]
    linkTarget = linkTarget.split('|')[0];
    outgoingLinksRaw.push(linkTarget);
  }

  // Tags
  const tags: string[] = [];
  // Parse tags from frontmatter or content
  if (data.tags) {
    if (Array.isArray(data.tags)) tags.push(...data.tags);
    else tags.push(data.tags);
  }
  const tagRegex = /#([\w-]+)/g;
  while ((match = tagRegex.exec(content)) !== null) {
    if (!tags.includes(match[1])) {
      tags.push(match[1]);
    }
  }

  // Preprocess content to convert wikilinks to HTML links
  const processedContent = content.replace(/\[\[(.*?)\]\]/g, (match, link) => {
    const parts = link.split('|');
    const target = parts[0];
    const text = parts[1] || target;
    const targetSlug = slugify(target, { lower: true, strict: false, locale: 'uz' });
    return `<a href="/article/${targetSlug}" class="wikilink" data-target="${targetSlug}">${text}</a>`;
  });

  const html = md.render(processedContent);

  const article: Article = {
    id: slug,
    title,
    slug,
    category,
    tags,
    content: processedContent, // save processed content
    html,
    outgoingLinks: outgoingLinksRaw.map(l => slugify(l, { lower: true, strict: false, locale: 'uz' })),
    backlinks: [], // Will be populated in pass 2
  };

  articles.push(article);
  slugToArticleMap.set(slug, article);
});

// Pass 2: Populate backlinks
articles.forEach(article => {
  article.outgoingLinks.forEach(targetSlug => {
    const targetArticle = slugToArticleMap.get(targetSlug);
    if (targetArticle && !targetArticle.backlinks.includes(article.slug)) {
      targetArticle.backlinks.push(article.slug);
    }
  });
});

// Write to JSON
const outputPath = path.join(PUBLIC_DIR, 'articles.json');
fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));

console.log(`Successfully parsed ${articles.length} articles.`);
console.log(`Data saved to ${outputPath}`);

// Generate Sitemap
generateSitemap(articles);

// Generate robots.txt
generateRobotsTxt();

function generateSitemap(articles: Article[]) {
  const domain = 'https://azizrakhimov.uz';
  const today = new Date().toISOString().split('T')[0];
  
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/articles</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/graph</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;

  for (const article of articles) {
    sitemapContent += `
  <url>
    <loc>${domain}/article/${article.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  sitemapContent += `\n</urlset>`;

  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
  console.log(`Sitemap generated: ${sitemapPath}`);
}

function generateRobotsTxt() {
  const robotsContent = `User-agent: *
Allow: /
Disallow: /search

Sitemap: https://azizrakhimov.uz/sitemap.xml
`;

  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
  console.log(`robots.txt generated: ${robotsPath}`);
}
