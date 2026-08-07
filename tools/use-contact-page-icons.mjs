import { readFile, writeFile } from 'node:fs/promises';

const htmlFile = 'contacto.html';
const iconRoot = 'imagenes/iconos/pagina contacto';
let html = await readFile(htmlFile, 'utf8');

function replaceSectionIcons(startMarker, endMarker, files) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);

  if (start === -1 || end === -1) {
    throw new Error(`No se encontró la sección delimitada por ${startMarker}`);
  }

  const section = html.slice(start, end);
  if (section.includes('contact-local-icon')) return;

  let iconIndex = 0;
  const updated = section.replace(/<svg\b[\s\S]*?<\/svg>/g, () => {
    const file = files[iconIndex++];
    if (!file) throw new Error(`Hay más iconos SVG de los esperados en ${startMarker}`);
    return `<img class="contact-local-icon" src="${iconRoot}/${file}" alt="" aria-hidden="true" />`;
  });

  if (iconIndex !== files.length) {
    throw new Error(`Se esperaban ${files.length} iconos en ${startMarker}, pero se encontraron ${iconIndex}`);
  }

  html = html.slice(0, start) + updated + html.slice(end);
}

replaceSectionIcons('<div class="hero-badges">', '<div class="hero-media">', [
  'handshake_48dp_6D45AA_FILL0_wght400_GRAD0_opsz48.svg',
  'schedule_48dp_129996_FILL0_wght400_GRAD0_opsz48.svg',
  'map_pin_review_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
]);

replaceSectionIcons('<aside\n            class="contact-side direct-contact"', '</aside>', [
  'mail_48dp_6D45AA_FILL0_wght400_GRAD0_opsz48.svg',
  'call_48dp_6D45AA_FILL0_wght400_GRAD0_opsz48.svg',
  'schedule_48dp_6D45AA_FILL0_wght400_GRAD0_opsz48.svg',
]);

replaceSectionIcons('<section class="section zones-section">', '<section class="section section--soft prep-section">', [
  'villa_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'location_on_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'language_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
]);

replaceSectionIcons('<section class="section section--soft prep-section">', '<section class="section">', [
  'filter_9_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'calendar_today_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'adjust_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
  'map_pin_heart_48dp_407BB2_FILL0_wght400_GRAD0_opsz48.svg',
  'attach_money_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
]);

if (!html.includes('lock_48dp_526176_FILL0_wght400_GRAD0_opsz48.svg')) {
  html = html.replace(
    /(<p class="privacy-note">)\s*[\s\S]*?(Tus datos están protegidos\.)/,
    `$1\n                    <img class="contact-local-icon" src="${iconRoot}/lock_48dp_526176_FILL0_wght400_GRAD0_opsz48.svg" alt="" aria-hidden="true" />\n                    $2`
  );
}

await writeFile(htmlFile, html, 'utf8');
