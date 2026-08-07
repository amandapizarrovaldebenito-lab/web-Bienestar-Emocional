import { readFile, writeFile } from 'node:fs/promises';

const file = 'experiencias.html';
let html = await readFile(file, 'utf8');
const placeholder = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Este espacio está preparado para incorporar una descripción más extensa de la experiencia, su contexto, propósito y principales resultados.';

html = html.replace(
  /(<h3 tabindex="-1">[\s\S]*?Detalle de la experiencia\s*<\/h3>)(?!\s*<p class="detail-description">)/g,
  `$1\n                  <p class="detail-description">${placeholder}</p>`
);

await writeFile(file, html, 'utf8');
