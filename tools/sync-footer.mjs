import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile('index.html', 'utf8');
const footer = source.match(/    <footer class="site-footer">[\s\S]*?    <\/footer>/)?.[0];

if (!footer) throw new Error('No se encontró el footer principal en index.html');

for (const file of ['nosotras.html', 'jornadas.html', 'experiencias.html', 'contacto.html']) {
  const html = await readFile(file, 'utf8');
  const updated = html.replace(/    <footer class="site-footer">[\s\S]*?    <\/footer>/, footer);
  if (updated === html) throw new Error(`No se pudo actualizar el footer de ${file}`);
  await writeFile(file, updated, 'utf8');
}
