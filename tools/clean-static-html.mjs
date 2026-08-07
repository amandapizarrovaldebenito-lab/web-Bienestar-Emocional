import { readFile, writeFile } from 'node:fs/promises';

const files = ['index.html', 'nosotras.html', 'jornadas.html', 'experiencias.html', 'contacto.html'];

for (const file of files) {
  let html = await readFile(file, 'utf8');

  // Header y footer son elementos semánticos directos, sin envoltorios usados
  // anteriormente como puntos de montaje de JavaScript.
  html = html
    .replace(/    <div data-header="">\r?\n      <header/g, '    <header')
    .replace(/      <\/header>\r?\n    <\/div>\r?\n    <main/g, '    </header>\n    <main')
    .replace(/    <div data-footer="">\r?\n      <footer/g, '    <footer')
    .replace(/      <\/footer>\r?\n    <\/div>\r?\n    <script/g, '    </footer>\n    <script');

  // Las variaciones visuales pertenecen al CSS, nunca al atributo style.
  html = html
    .replace('class="experience" style="--experience-accent: #8c74cd"', 'class="experience experience--violet"')
    .replace('class="experience" style="--experience-accent: #3eaaa9"', 'class="experience experience--aqua"')
    .replace('class="experience" style="--experience-accent: #3283ae"', 'class="experience experience--blue"');

  await writeFile(file, html, 'utf8');
}
