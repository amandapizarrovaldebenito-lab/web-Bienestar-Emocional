import { readFile, writeFile } from 'node:fs/promises';

const file = 'jornadas.html';
let html = await readFile(file, 'utf8');
const base = 'imagenes/iconos/pagina%20jornadas/';

const cards = [
  {
    className: 'journey-program-1',
    duration: '1 hora y 30 minutos',
    main: 'self_improvement_48dp_1687A5_FILL0_wght400_GRAD0_opsz48.svg',
    schedule: 'schedule_24dp_5531A1_FILL0_wght400_GRAD0_opsz24.svg',
    computer: 'computer_24dp_5531A1_FILL0_wght400_GRAD0_opsz24.svg'
  },
  {
    className: 'journey-program-2',
    duration: '2 horas y 30 minutos',
    main: 'person_heart_48dp_2568AC_FILL0_wght400_GRAD0_opsz48.svg',
    schedule: 'schedule_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg',
    computer: 'computer_24dp_2568AC_FILL0_wght400_GRAD0_opsz24.svg'
  },
  {
    className: 'journey-program-3',
    duration: '3 horas',
    main: 'spa_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
    schedule: 'schedule_24dp_1687A5_FILL0_wght400_GRAD0_opsz24.svg',
    computer: 'computer_24dp_1687A5_FILL0_wght400_GRAD0_opsz24.svg'
  }
];

for (const card of cards) {
  const classValue = card.className === 'journey-program-2'
    ? `card program-card featured ${card.className}`
    : `card program-card ${card.className}`;
  const start = html.indexOf(`<article class="${classValue}">`);
  const end = html.indexOf('</article>', start) + '</article>'.length;
  let article = html.slice(start, end);

  article = article.replace(
    /<span class="journey-program-icon">[\s\S]*?<\/span>/,
    `<span class="journey-program-icon"><img src="${base}${card.main}" alt="" /></span>`
  );
  article = article.replace(
    /(<div class="journey-program-meta">)\s*<span>[\s\S]*?<\/span\s*>\s*<span>[\s\S]*?<\/span\s*>/,
    `$1\n                  <span><img src="${base}${card.schedule}" alt="" />${card.duration}</span>\n                  <span><img src="${base}${card.computer}" alt="" />Presencial o virtual</span>`
  );

  html = html.slice(0, start) + article + html.slice(end);
}

await writeFile(file, html, 'utf8');
