# 👶✨ Generador de nombres

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)

**Genera combinaciones de nombres para tu bebé, con sus apellidos, hasta que uno te robe el corazón.**

👉 **Pruébala aquí: [icortesi.github.io/generador_de_nombres](https://icortesi.github.io/generador_de_nombres/)**

## 📖 Un poco de historia

Cuando mi hija estaba por nacer, decidimos que ella debería tener su propio nombre y no heredar alguno de alguien de la familia. Así que se me ocurrió crear esta pequeña app para generar muchas combinaciones de nombres con la esperanza de encontrar uno que me gustara ("If brute force doesn't work, you aren't using enough" 💪). En su momento, yo era web developer y mi stack de entonces era jQuery y Bootstrap.

Empezó también como un pequeño ejercicio en el uso de Git. En 2026 la app se renovó por completo: ahora es mobile-first, no tiene dependencias y está pensada para que la pareja pueda armar su lista corta y compartirla. Los detalles están en el [CHANGELOG](CHANGELOG.md).

## ✨ Qué puedes hacer

- 🎲 **Generar combinaciones** de uno, dos o tres nombres (*telenovelesco* 🎭) con tus apellidos.
- 👧👦 Elegir **Niña**, **Niño** o **Sorpresa**.
- 🔄 **Cambiar un solo nombre** de la combinación y quedarte con el que sí te gustó.
- ♡ **Guardar favoritos** para armar tu lista corta.
- 📤 **Compartir** un nombre con un enlace a su propia página, o la lista completa por WhatsApp, correo, etc.
- 🔤 Ver las **iniciales** y el **RFC** que tendría, por si alguna combinación forma algo incómodo.
- 📱 Usarla cómodamente en el teléfono o en la compu, siempre en tonos claros y pastel.

## 🚀 Cómo usarla

1. Entra a [icortesi.github.io/generador_de_nombres](https://icortesi.github.io/generador_de_nombres/).
2. Elige **Niña**, **Niño** o **Sorpresa**. En *Sorpresa*, cada combinación sale de una sola lista para no mezclar.
3. Escribe los apellidos que tendrá el bebé. Pueden ser uno o dos, y las partículas como "de la" funcionan.
4. Elige cuántos nombres combinar.
5. Si quieres, ajusta la **fecha estimada de nacimiento**. Por defecto es hoy + 9 meses y solo se usa para el RFC.
6. Presiona **Generar nombre** (o Enter) cuantas veces quieras. Los nuevos aparecen arriba y no se repiten.
7. Toca cualquier nombre subrayado para cambiar **solo ese**.
8. Toca **♡ Guardar** para mandarlo a **Favoritos**.
9. Toca **Compartir** en una tarjeta para mandar el enlace de ese nombre, o usa **Compartir lista** y **Copiar** arriba de la lista para mandar todos.

## 🔗 Compartir un nombre

Cada nombre tiene su propia página, con un enlace corto y legible:

```
https://icortesi.github.io/generador_de_nombres/share?n=Sofía-Elena&a=Cortés-López
```

- `n`: los nombres, separados por guion.
- `a` (opcional): los apellidos, también separados por guion.

Las letras con tilde y la Ñ van tal cual; el navegador codifica lo necesario al abrir el enlace. La página valida los datos y los muestra solo como texto. Si el enlace llega cortado o inválido, muestra un aviso amable con un botón para volver al generador.

> Los enlaces del formato anterior (`share?name=["Sofía","Elena","Cortés","López"]`) siguen funcionando: la página los convierte sola al formato nuevo.

## 🔒 Privacidad

No hay servidor ni base de datos: todo ocurre en tu navegador.

- Los **favoritos**, el formulario y los resultados se guardan en el `localStorage` de tu navegador. Si lo borras o abres la app en otro dispositivo, no estarán.
- Los enlaces para compartir llevan el nombre **dentro de la URL**. No se guarda nada en ningún lado.

## 🧾 Sobre el RFC

Se muestran los **10 primeros caracteres del RFC, sin homoclave**, calculados con las reglas simplificadas del SAT:
- primera letra del apellido paterno y su primera vocal interna;
- primera letra del apellido materno;
- primera letra del nombre (se salta *María* o *José* si hay un segundo nombre);
- fecha en formato AAMMDD.

También contempla partículas ("de", "la", "del"…), la regla de un solo apellido, acentos, la Ñ y las palabras inconvenientes (por ejemplo, `COLA` se vuelve `COLX`).

> ⚠️ Es una referencia divertida, no un cálculo oficial: el RFC real lo asigna el SAT.

## 🗂️ Estructura

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Página principal del generador. |
| `share.html` | Página de detalle que se comparte (GitHub Pages la sirve en `/share`). |
| `css/estilos.css` | Estilos mobile-first: paleta pastel en tema claro y dos columnas en escritorio. |
| `js/logica.js` | Lógica pura sin DOM: RFC, iniciales, selección aleatoria y enlaces para compartir. |
| `js/app.js` | Interfaz del generador: eventos, favoritos y pintado. |
| `js/compartir.js` | Lógica de la página de detalle. |
| `nombres.json` | Listas de nombres de niña y niño (solo nombres simples, sin duplicados). |

## 🛠️ Desarrollo local

No hay nada que instalar ni compilar. Solo necesitas un servidor estático, porque los módulos de JavaScript no funcionan abriendo el archivo directamente:

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

> En local, la página de detalle se abre como `http://localhost:8000/share.html?n=Sofía`. La ruta corta `/share` solo funciona en GitHub Pages.

Para publicar, basta con fusionar a `master`: GitHub Pages actualiza el sitio solo.

## 🤝 Contribuciones

Se aceptan todo tipo de contribuciones que mejoren el algoritmo y la presentación. ¡Las mejoras siempre son bienvenidas! 🎉

Para agregar nombres, edita `nombres.json` y usa nombres simples: la app ya combina dos o tres por su cuenta.

### 📝 Ideas pendientes
- Actualizar y ampliar la lista de nombres.
- Filtrar por letra inicial.
- Agregar nombres propios desde la app.
- Mostrar el RFC en la página de detalle.

## 📜 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](https://opensource.org/licenses/MIT). Eres libre de usar, modificar y distribuir el código, siempre que se atribuya el reconocimiento al autor original.
