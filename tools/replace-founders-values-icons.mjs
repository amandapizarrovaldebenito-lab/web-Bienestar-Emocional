import { readFile, writeFile } from 'node:fs/promises';

const file = 'nosotras.html';
let html = await readFile(file, 'utf8');
const base = 'imagenes/iconos/pagina%20nosotras/';

const founderIcons = [
  'conversation_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'digital_wellbeing_48dp_129996_FILL0_wght400_GRAD0_opsz48.svg'
];
let founderIndex = 0;
html = html.replace(
  /<span class="founder-symbol">[\s\S]*?<\/span>/g,
  () => `<span class="founder-symbol"><img src="${base}${founderIcons[founderIndex++]}" alt="" /></span>`
);

const values = [
  ['Integridad', 'person_shield_48dp_6D45AA_FILL0_wght400_GRAD0_opsz48.svg'],
  ['Respeto', 'person_check_48dp_1687A5_FILL0_wght400_GRAD0_opsz48.svg'],
  ['Responsabilidad', 'article_person_48dp_6D45AA_FILL0_wght400_GRAD0_opsz48.svg'],
  ['Sostenibilidad', 'nest_eco_leaf_48dp_2568AC_FILL0_wght400_GRAD0_opsz48.svg'],
  ['Empatía', 'psychology_48dp_6D45AA_FILL0_wght400_GRAD0_opsz48.svg'],
  ['Confianza', 'handshake_48dp_407BB2_FILL0_wght400_GRAD0_opsz48.svg'],
  ['Evidencia', 'fact_check_48dp_129996_FILL0_wght400_GRAD0_opsz48.svg']
];

const valuesStart = html.indexOf('<div class="values">');
const valuesEnd = html.indexOf('</div>', valuesStart) + '</div>'.length;
const valuesMarkup = `<div class="values">\n${values.map(([label, icon]) =>
  `            <span class="value"><img src="${base}${icon}" alt="" />${label}</span>`
).join('\n')}\n          </div>`;
html = html.slice(0, valuesStart) + valuesMarkup + html.slice(valuesEnd);

await writeFile(file, html, 'utf8');
