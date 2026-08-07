import { readFile, writeFile } from 'node:fs/promises';

const file = 'jornadas.html';
let html = await readFile(file, 'utf8');
const base = 'imagenes/iconos/pagina%20jornadas/';
const icons = {
  1: 'search_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  2: 'stylus_note_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  3: 'group_add_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  4: 'analytics_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  5: 'bookmark_check_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg'
};

const sectionStart = html.indexOf('<section class="section methodology-section">');
const sectionEnd = html.indexOf('</section>', sectionStart) + '</section>'.length;
let section = html.slice(sectionStart, sectionEnd);

section = section.replace(
  /<b>\s*<span>([1-5])<\/span>\s*<svg[\s\S]*?<\/svg>\s*<\/b>/g,
  (_, number) => `<b><span>${number}</span><img src="${base}${icons[number]}" alt="" /></b>`
);

html = html.slice(0, sectionStart) + section + html.slice(sectionEnd);
await writeFile(file, html, 'utf8');
