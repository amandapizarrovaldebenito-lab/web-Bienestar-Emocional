import { readFile, writeFile } from 'node:fs/promises';

const file = 'nosotras.html';
let html = await readFile(file, 'utf8');
const base = 'imagenes/iconos/pagina%20nosotras/';

const replaceIconsInSection = (sectionClass, files, pattern, createMarkup) => {
  const start = html.indexOf(`<section class="${sectionClass}`);
  const end = html.indexOf('</section>', start) + '</section>'.length;
  let section = html.slice(start, end);
  let index = 0;
  section = section.replace(pattern, () => createMarkup(files[index++]));
  html = html.slice(0, start) + section + html.slice(end);
};

replaceIconsInSection(
  'trait-strip',
  [
    'account_child_invert_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
    'diversity_2_48dp_407BB2_FILL0_wght400_GRAD0_opsz48.svg',
    'fact_check_48dp_129996_FILL0_wght400_GRAD0_opsz48.svg'
  ],
  /<b>[\s\S]*?<\/b>/g,
  icon => `<b><img src="${base}${icon}" alt="" /></b>`
);

replaceIconsInSection(
  'section network-section',
  [
    'diversity_3_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
    'toys_and_games_48dp_407BB2_FILL0_wght400_GRAD0_opsz48.svg',
    'person_raised_hand_48dp_129996_FILL0_wght400_GRAD0_opsz48.svg'
  ],
  /<div class="card-icon">[\s\S]*?<\/div>/g,
  icon => `<div class="card-icon"><img src="${base}${icon}" alt="" /></div>`
);

replaceIconsInSection(
  'section section--soft guides-section',
  [
    'assignment_globe_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
    'visibility_48dp_407BB2_FILL0_wght400_GRAD0_opsz48.svg',
    'psychiatry_48dp_129996_FILL0_wght400_GRAD0_opsz48.svg'
  ],
  /<div class="card-icon">[\s\S]*?<\/div>/g,
  icon => `<div class="card-icon"><img src="${base}${icon}" alt="" /></div>`
);

await writeFile(file, html, 'utf8');
