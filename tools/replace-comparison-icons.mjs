import { readFile, writeFile } from 'node:fs/promises';

const file = 'jornadas.html';
let html = await readFile(file, 'utf8');
const base = 'imagenes/iconos/pagina%20jornadas/';

const start = html.indexOf('<section class="section section--soft journey-comparison">');
const end = html.indexOf('</section>', start) + '</section>'.length;
let section = html.slice(start, end);

const journeyIcons = [
  'self_improvement_48dp_1687A5_FILL0_wght400_GRAD0_opsz48.svg',
  'person_heart_48dp_2568AC_FILL0_wght400_GRAD0_opsz48.svg',
  'spa_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg'
];
let journeyIndex = 0;
const theadStart = section.indexOf('<thead>');
const theadEnd = section.indexOf('</thead>') + '</thead>'.length;
let thead = section.slice(theadStart, theadEnd);
thead = thead.replace(
  /<span>\s*<svg[\s\S]*?<\/svg>\s*<\/span\s*>/g,
  () => `<span><img src="${base}${journeyIcons[journeyIndex++]}" alt="" /></span>`
);
section = section.slice(0, theadStart) + thead + section.slice(theadEnd);

const rowIcons = [
  'schedule_48dp_129996_FILL0_wght400_GRAD0_opsz48.svg',
  'adjust_48dp_129996_FILL0_wght400_GRAD0_opsz48.svg',
  'person_48dp_129996_FILL0_wght400_GRAD0_opsz48.svg'
];
let rowIndex = 0;
section = section.replace(
  /(<tbody>[\s\S]*?<th>)\s*<svg[\s\S]*?<\/svg>/,
  (_, prefix) => `${prefix}\n                    <img src="${base}${rowIcons[rowIndex++]}" alt="" />`
);
section = section.replace(
  /(<\/tr>\s*<tr>\s*<th>)\s*<svg[\s\S]*?<\/svg>/g,
  (_, prefix) => `${prefix}\n                    <img src="${base}${rowIcons[rowIndex++]}" alt="" />`
);

html = html.slice(0, start) + section + html.slice(end);
await writeFile(file, html, 'utf8');
