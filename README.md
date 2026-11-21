# 👶✨ Generador de nombres
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)


Este es un pequeño ejercicio en el uso de Git.

## 📖 Un poco de historia

Cuando mi hija estaba por nacer, decidimos que ella debería tener su propio nombre y no heredar alguno de alguien de la familia. Así que se me ocurrió crear esta pequeña app para generar muchas combinaciones de nombres con la esperanza de encontrar uno que me gustara ("If brute force doesn't work, you aren't using enough" 💪). En su momento, yo era web developer y mi stack era el que utilicé aquí; soy consciente de que hoy en día existen mejores herramientas.

## 💡 Descripción

Esta aplicación genera combinaciones de nombres y los muestra junto con los posibles apellidos, para que las parejas que esperan un bebé puedan ver muchas combinaciones antes de decidir.

## 🚀 Cómo usarla
1. Entra a https://icortesi.github.io/generador_de_nombres/
2. Elige **Niña**, **Niño** o **Sorpresa** (cada combinación sale de una sola lista, para no mezclar).
3. Escribe los apellidos que tendrá el bebé (uno o dos; partículas como "de la" funcionan).
4. Elige cuántos nombres combinar: uno, dos o *telenovelesco* (tres) 🎭.
5. Ajusta la fecha estimada de nacimiento si quieres (por defecto, hoy + 9 meses). Se usa para el RFC.
6. Presiona **Generar nombre** (o Enter) cuantas veces quieras. Los nuevos aparecen arriba y no se repiten.
7. Toca cualquier nombre de una combinación para cambiar **solo ese** 🔄.
8. Guarda los que te gusten con ♡: quedan en la pestaña **Favoritos**, guardados en tu navegador.
9. El botón ↗ de cada nombre comparte un enlace a su página de detalle, `share?name=["Sofía","Elena","Cortés","López"]`. No se guarda nada en ningún servidor: el nombre viaja en la URL.
10. **Compartir** (arriba de la lista) abre el menú del teléfono con todos los nombres; **Copiar** los manda al portapapeles.

## 🗂️ Estructura
- `index.html`: la página.
- `css/estilos.css`: estilos, móvil primero, con modo oscuro y dos columnas en escritorio.
- `js/logica.js`: lógica pura (RFC, iniciales, selección aleatoria), sin DOM.
- `js/app.js`: interfaz y eventos.
- `share.html` + `js/compartir.js`: página de detalle que se comparte (GitHub Pages la sirve en `/share`).
- `nombres.json`: listas de nombres (solo nombres simples, sin duplicados).

El RFC que se muestra es el de 10 caracteres **sin homoclave**, con las reglas simplificadas del SAT (primera vocal interna, partículas, María/José, palabras inconvenientes y un solo apellido).

Para probarla localmente sirve la carpeta con cualquier servidor estático, por ejemplo `python3 -m http.server`.

## 🤝 Contribuciones

Se aceptan todo tipo de contribuciones que mejoren el algoritmo y la presentación. ¡Las mejoras siempre son bienvenidas! 🎉

### 📝 TODO
- Actualizar la lista de nombres

## 📜 License 

Este proyecto está licenciado bajo la [Licencia MIT](https://opensource.org/licenses/MIT). Eres libre de usar, modificar y distribuir el código, siempre que se atribuya el reconocimiento al autor original.
