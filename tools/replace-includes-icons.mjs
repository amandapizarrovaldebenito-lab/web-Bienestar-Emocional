import { readFile, writeFile } from 'node:fs/promises';

const file = 'jornadas.html';
let html = await readFile(file, 'utf8');
const base = 'imagenes/iconos/pagina%20jornadas/';
const icons = [
  'group_48dp_2568AC_FILL0_wght400_GRAD0_opsz48.svg',
  'export_notes_48dp_6D45AA_FILL0_wght400_GRAD0_opsz48.svg',
  'finance_mode_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'verified_user_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'partner_heart_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg'
];

const start = html.indexOf('<section class="section journey-includes">');
const end = html.indexOf('</section>', start) + '</section>'.length;
let section = html.slice(start, end);
let index = 0;

section = section.replace(
  /<div class="card-icon">[\s\S]*?<\/div>/g,
  () => `<div class="card-icon"><img src="${base}${icons[index++]}" alt="" /></div>`
);

html = html.slice(0, start) + section + html.slice(end);
await writeFile(file, html, 'utf8');
