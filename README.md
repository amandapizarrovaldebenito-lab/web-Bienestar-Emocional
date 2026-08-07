# Bienestar Presente

Sitio estático multipágina construido a partir de las maquetas PDF de `Maquetas/`.

## Ejecutar

Abre `index.html` directamente o sirve la carpeta con un servidor estático:

```powershell
python -m http.server 8080
```

Después visita `http://localhost:8080`.

## Estructura

- `index.html`, `nosotras.html`, `jornadas.html`, `experiencias.html` y `contacto.html`: estructura HTML5 y todo el contenido visible de cada página, incluido header y footer.
- `assets/css/styles.css`: variables, estilos globales, componentes, páginas y reglas responsive.
- `assets/js/main.js`: únicamente comportamiento del menú móvil, experiencias desplegables y formulario.
- `assets/images/`: recursos gráficos locales recuperados de las maquetas.

No se utilizan estilos inline ni contenido visual generado desde JavaScript.

## Decisiones técnicas

La implementación utiliza HTML5 semántico, CSS3 y JavaScript vanilla. La escala tipográfica está centralizada en variables CSS con unidades `rem` y funciones `clamp()`. También se incluyen navegación por teclado, estados de foco, reducción de movimiento y reorganización específica para tablet y móvil.

Las tipografías se cargan desde Google Fonts con alternativas locales. Para trabajar completamente sin conexión, se deben descargar DM Sans y Playfair Display y servirlas desde `assets/fonts/`.

## Recursos pendientes

Las fotografías se recuperaron de las composiciones PDF y pueden tener una resolución limitada. Deben reemplazarse por los archivos originales cuando estén disponibles. Los nombres, teléfonos y algunos datos institucionales son provisionales.

## Formulario

El formulario valida los datos en el navegador y muestra una confirmación local. Para conectarlo a un backend, reemplaza el manejador de `#contact-form` en `assets/js/main.js` por una llamada `fetch()` al endpoint autorizado, conservando la validación y los mensajes accesibles.
