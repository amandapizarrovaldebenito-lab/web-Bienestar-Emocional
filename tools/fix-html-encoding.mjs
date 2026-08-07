import { readFile, writeFile } from 'node:fs/promises';

const files = ['index.html', 'nosotras.html', 'jornadas.html', 'experiencias.html', 'contacto.html'];
const replacements = new Map([
  ['Ã¡', 'á'], ['Ã©', 'é'], ['Ã­', 'í'], ['Ã³', 'ó'], ['Ãº', 'ú'],
  ['Ã±', 'ñ'], ['Ã', 'Á'], ['Â¿', '¿'], ['Â©', '©'], ['Â·', '·'],
  ['â†’', '→'], ['â€“', '–'], ['â€”', '—'], ['â€œ', '“'], ['â€', '”'],
  ['â˜°', '☰'], ['â˜Ž', '☎'], ['â˜…', '★'], ['âœ‰', '✉'], ['âœ“', '✓'],
  ['â–£', '▣'], ['â–·', '▷'], ['â—·', '◷'], ['â—‰', '◉'], ['â—Ž', '◎'],
  ['â—’', '◒'], ['âŒ‚', '⌂'], ['â™§', '♧']
]);

for (const file of files) {
  let html = await readFile(file, 'utf8');
  for (const [broken, correct] of replacements) html = html.split(broken).join(correct);
  await writeFile(file, html, 'utf8');
}
