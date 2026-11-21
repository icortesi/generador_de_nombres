// Página de detalle: muestra el nombre que viene en la URL sin guardar nada.
import { leerNombreCompartido, enlaceCompartir, iniciales } from './logica.js?v=7';

const $ = selector => document.querySelector(selector);
const datos = leerNombreCompartido(location.search);
// Siempre compartimos el enlace en su forma legible (también si llegó con el formato viejo).
const enlace = datos ? enlaceCompartir(location.href, datos.nombres, datos.apellidos) : location.href;

let temporizador;
function avisar(mensaje) {
    const aviso = $('#aviso');
    aviso.textContent = mensaje;
    aviso.classList.add('visible');
    clearTimeout(temporizador);
    temporizador = setTimeout(() => aviso.classList.remove('visible'), 2200);
}

async function copiarEnlace() {
    try {
        await navigator.clipboard.writeText(enlace);
        avisar('¡Enlace copiado! 🔗');
    } catch {
        avisar('No pude copiar. Copia la dirección del navegador, porfa.');
    }
}

if (datos) {
    const nombreCompleto = [...datos.nombres, ...datos.apellidos].join(' ');
    // textContent: nunca interpretamos como HTML lo que viene en el enlace.
    $('#nombre').textContent = nombreCompleto;
    $('#iniciales').textContent = iniciales(datos.nombres, datos.apellidos);
    document.title = `${nombreCompleto} · Generador de nombres`;
    if (location.search !== new URL(enlace).search) history.replaceState(null, '', enlace);
    $('#detalle').hidden = false;

    $('#copiar').addEventListener('click', copiarEnlace);
    $('#compartir').addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: nombreCompleto, url: enlace });
                return;
            } catch (error) {
                if (error.name === 'AbortError') return;
            }
        }
        await copiarEnlace();
    });
} else {
    $('#invalido').hidden = false;
}
