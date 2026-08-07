import { readFile, writeFile } from 'node:fs/promises';

const file = 'experiencias.html';
const icon = 'imagenes/iconos/pagina%20experiencias/description_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg';
let html = await readFile(file, 'utf8');

html = html.replace(
  /(<h3 tabindex="-1">\s*<span>)\s*<svg\b[\s\S]*?<\/svg>(\s*<\/span\s*>\s*Detalle de la experiencia)/g,
  `$1\n                      <img class="detail-heading-icon" src="${icon}" alt="" aria-hidden="true" />$2`
);

await writeFile(file, html, 'utf8');
