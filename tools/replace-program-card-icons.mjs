import { readFile, writeFile } from 'node:fs/promises';

const file = 'index.html';
let html = await readFile(file, 'utf8');
const base = 'imagenes/iconos/pagina%20de%20inicio/';

const cards = [
  {
    className: 'journey-program-1',
    main: 'self_improvement_48dp_1687A5_FILL0_wght400_GRAD0_opsz48.svg',
    schedule: 'schedule_24dp_5531A1_FILL0_wght400_GRAD0_opsz24.svg',
    computer: 'computer_24dp_5531A1_FILL0_wght400_GRAD0_opsz24.svg'
  },
  {
    className: 'journey-program-2',
    main: 'person_heart_48dp_2568AC_FILL0_wght400_GRAD0_opsz48.svg',
    schedule: 'schedule_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg',
    computer: 'computer_24dp_2568AC_FILL0_wght400_GRAD0_opsz24.svg'
  },
  {
    className: 'journey-program-3',
    main: 'spa_48dp_5531A1_FILL0_wght400_GRAD0_opsz48.svg',
    schedule: 'schedule_24dp_1687A5_FILL0_wght400_GRAD0_opsz24.svg',
    computer: 'computer_24dp_1687A5_FILL0_wght400_GRAD0_opsz24.svg'
  }
];

for (const card of cards) {
  const start = html.indexOf(`<article class="card program-card${card.className === 'journey-program-2' ? ' featured' : ''} ${card.className}">`);
  const end = html.indexOf('</article>', start) + '</article>'.length;
  let article = html.slice(start, end);

  article = article.replace(
    /<div class="card-icon journey-program-icon">[\s\S]*?<\/div>/,
    `<div class="card-icon journey-program-icon"><img src="${base}${card.main}" alt="" /></div>`
  );
  article = article.replace(
    /(<div class="program-meta journey-program-meta">)\s*<span>[\s\S]*?<\/span>\s*<span>[\s\S]*?<\/span>/,
    `$1\n                  <span><img src="${base}${card.schedule}" alt="" />$LEFT_DURATION</span>\n                  <span><img src="${base}${card.computer}" alt="" />Presencial o virtual</span>`
  );

  const duration = card.className === 'journey-program-1'
    ? '1 hora y 30 minutos'
    : card.className === 'journey-program-2' ? '2 horas y 30 minutos' : '3 horas';
  article = article.replace('$LEFT_DURATION', duration);
  html = html.slice(0, start) + article + html.slice(end);
}

await writeFile(file, html, 'utf8');
