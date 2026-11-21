# 📜 Changelog

Todos los cambios importantes de este proyecto se documentan aquí.
El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones siguen [Versionado Semántico](https://semver.org/lang/es/).

## [2.2.0] - 2026-11-21

### Cambiado
- Nueva **paleta pastel**: lavanda como color principal, con rosa, celeste y menta de apoyo, y un fondo en degradado suave ([#5](https://github.com/icortesi/generador_de_nombres/pull/5)).
- Chips de género con su propio color (Niña rosa, Niño celeste, Sorpresa menta) y tarjetas con borde del color del género.
- Modo oscuro ajustado con las mismas tonalidades. Todo el texto cumple el contraste WCAG AA.
- Cada tarjeta tiene botones con texto, **♡ Guardar** y **Compartir**, en lugar de iconos sueltos. El de la barra pasa a llamarse **Compartir lista** ([#7](https://github.com/icortesi/generador_de_nombres/pull/7)).
- Enlaces para compartir más cortos y legibles: `share?n=Sofía-Elena&a=Cortés-López`. Los del formato anterior siguen funcionando ([#7](https://github.com/icortesi/generador_de_nombres/pull/7)).
- README renovado y este CHANGELOG ([#6](https://github.com/icortesi/generador_de_nombres/pull/6)).

## [2.1.0] - 2026-11-21

### Agregado
- **Página de detalle para compartir** en `/share`: muestra un nombre en grande con sus iniciales, sin guardar nada en ningún servidor ([#4](https://github.com/icortesi/generador_de_nombres/pull/4)).
- El botón de compartir de cada tarjeta manda ese enlace con el menú nativo del teléfono, o lo copia si el navegador no lo soporta.

### Seguridad
- El parámetro `name` se valida (array de 1 a 8 textos, de 40 caracteres como máximo) y se pinta solo como texto.

## [2.0.0] - 2026-11-21

Rediseño completo, mobile-first ([#3](https://github.com/icortesi/generador_de_nombres/pull/3)).

### Agregado
- **Favoritos** ♡ guardados en el navegador, en su propia pestaña.
- **Cambiar un solo nombre** de una combinación tocándolo.
- Opción **Sorpresa** para generar nombres de cualquier género.
- **Fecha estimada de nacimiento** editable para el RFC (por defecto, hoy + 9 meses).
- Compartir la lista con el menú nativo del teléfono, botón **Limpiar** con *Deshacer* y modo oscuro.
- Las combinaciones no se repiten, y el formulario y los resultados se recuerdan al recargar.

### Cambiado
- Interfaz nueva: chips en lugar de radios y select, botón "Generar" fijo abajo en móvil, dos columnas en escritorio y resultados en tarjetas (los más nuevos arriba).
- Validación dentro del formulario en lugar de `alert()`.
- Se quitaron Bootstrap 5.3.0-alpha1 y jQuery. El código ahora está separado en `css/`, `js/logica.js` y `js/app.js`.
- `nombres.json`: los nombres compuestos se separaron en nombres simples y se quitaron los duplicados.

### Corregido
- Con un solo apellido no se generaba nada.
- Presionar Enter en el campo de apellidos recargaba la página y borraba los resultados.
- El botón de copiar se registraba de nuevo en cada clic y copiaba varias veces.
- El RFC ahora sigue las reglas del SAT: primera vocal interna, partículas, María/José, un solo apellido y palabras inconvenientes.
- Sumar 9 meses ya no brinca de mes (31 de mayo + 9 meses = 28 de febrero).

## [1.1.0] - 2024-09-19

### Cambiado
- Diseño simplificado y nombres movidos a un archivo `nombres.json` aparte ([#1](https://github.com/icortesi/generador_de_nombres/pull/1)).
- Ajustes de redacción ([#2](https://github.com/icortesi/generador_de_nombres/pull/2)).

### Agregado
- Botón **Copiar al portapapeles**.
- README con la historia del proyecto.

## [1.0.0] - 2018-11-07

### Agregado
- Publicación en GitHub Pages y estilos con Bootstrap.

## [0.1.0] - 2017-01-17

### Agregado
- Primera versión del generador.

[2.2.0]: https://github.com/icortesi/generador_de_nombres/pull/5
[2.1.0]: https://github.com/icortesi/generador_de_nombres/pull/4
[2.0.0]: https://github.com/icortesi/generador_de_nombres/pull/3
[1.1.0]: https://github.com/icortesi/generador_de_nombres/pull/1
