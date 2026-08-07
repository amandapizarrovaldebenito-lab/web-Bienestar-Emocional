import { readFile, writeFile } from 'node:fs/promises';

const file = 'experiencias.html';
let html = await readFile(file, 'utf8');
const base = 'imagenes/iconos/pagina%20experiencias/';

const heroStart = html.indexOf('<div class="hero-badges">');
const heroEnd = html.indexOf('</div>', heroStart) + '</div>'.length;
let hero = html.slice(heroStart, heroEnd);
const heroIcons = [
  'map_pin_heart_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'water_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'chat_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg'
];
let heroIndex = 0;
hero = hero.replace(
  /<svg[\s\S]*?<\/svg>/g,
  () => `<img src="${base}${heroIcons[heroIndex++]}" alt="" />`
);
html = html.slice(0, heroStart) + hero + html.slice(heroEnd);

const calendar = 'calendar_month_48dp_526176_FILL0_wght400_GRAD0_opsz48.svg';
const schedule = 'schedule_48dp_526176_FILL0_wght400_GRAD0_opsz48.svg';
let searchFrom = 0;

while (true) {
  const articleStart = html.indexOf('<article class="experience ', searchFrom);
  if (articleStart === -1) break;
  const articleEnd = html.indexOf('</article>', articleStart) + '</article>'.length;
  let article = html.slice(articleStart, articleEnd);
  const isPresent = article.includes('class="experience-type">Jornada Presente');
  const typeIcon = isPresent
    ? 'self_improvement_48dp_526176_FILL0_wght400_GRAD0_opsz48.svg'
    : 'person_heart_48dp_526176_FILL0_wght400_GRAD0_opsz48.svg';
  const typeLabel = isPresent ? 'Jornada Presente' : 'Jornada Bienestar';

  const metaStart = article.indexOf('<div class="meta">');
  const metaEnd = article.indexOf('</div>', metaStart) + '</div>'.length;
  const originalMeta = article.slice(metaStart, metaEnd);
  const texts = [...originalMeta.matchAll(/<span>([\s\S]*?)<\/span>/g)].map(match =>
    match[1].replace(/<[^>]+>/g, '').replace(/^[^\p{L}\p{N}]+/u, '').trim()
  );
  const date = texts[0] || 'Fecha por confirmar';
  const duration = texts[2] || 'Duración por confirmar';
  const meta = `<div class="meta">\n                    <span><img src="${base}${calendar}" alt="" />${date}</span>\n                    <span><img src="${base}${typeIcon}" alt="" />${typeLabel}</span>\n                    <span><img src="${base}${schedule}" alt="" />${duration}</span>\n                  </div>`;
  article = article.slice(0, metaStart) + meta + article.slice(metaEnd);

  html = html.slice(0, articleStart) + article + html.slice(articleEnd);
  searchFrom = articleStart + article.length;
}

await writeFile(file, html, 'utf8');
