import { readFile, writeFile } from 'node:fs/promises';

const file = 'index.html';
let html = await readFile(file, 'utf8');
const base = 'imagenes/iconos/pagina%20de%20inicio/';

const benefitIcons = [
  'neurology_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'workspace_premium_48dp_407BB2_FILL0_wght400_GRAD0_opsz48.svg',
  'groups_48dp_407BB2_FILL0_wght400_GRAD0_opsz48.svg',
  'home_repair_service_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg'
];

const benefitStart = html.indexOf('<section class="benefit-strip"');
const benefitEnd = html.indexOf('</section>', benefitStart) + '</section>'.length;
let benefitSection = html.slice(benefitStart, benefitEnd);
let benefitIndex = 0;

benefitSection = benefitSection.replace(
  /<span>\s*<svg[\s\S]*?<\/svg>\s*<\/span>/g,
  () => `<span class="benefit-icon"><img src="${base}${benefitIcons[benefitIndex++]}" alt="" /></span>`
);

html = html.slice(0, benefitStart) + benefitSection + html.slice(benefitEnd);

const processIcons = {
  1: 'cognition_48dp_2568AC_FILL0_wght400_GRAD0_opsz48.svg',
  2: 'pulmonology_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  3: 'volunteer_activism_48dp_1687A5_FILL0_wght400_GRAD0_opsz48.svg',
  4: 'diversity_1_48dp_1687A5_FILL0_wght400_GRAD0_opsz48.svg',
  5: 'potted_plant_48dp_407BB2_FILL0_wght400_GRAD0_opsz48.svg'
};

html = html.replace(
  /<b>\s*<svg[\s\S]*?<\/svg>\s*<span>([1-5])<\/span>\s*<\/b>/g,
  (_, number) => `<b><img src="${base}${processIcons[number]}" alt="" /><span>${number}</span></b>`
);

await writeFile(file, html, 'utf8');
