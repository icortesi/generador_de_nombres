// Página de detalle: muestra el nombre que viene en ?name=[...] sin guardar nada.
import { leerNombreCompartido } from './logica.js';

const $ = selector => document.querySelector(selector);
const palabras = leerNombreCompartido(location.search);

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
        await navigator.clipboard.writeText(location.href);
        avisar('¡Enlace copiado! 🔗');
    } catch {
        avisar('No pude copiar. Copia la dirección del navegador, porfa.');
    }
}

if (palabras) {
    const nombreCompleto = palabras.join(' ');
    // textContent: nunca interpretamos como HTML lo que viene en el enlace.
    $('#nombre').textContent = nombreCompleto;
    $('#iniciales').textContent = palabras.map(p => p.charAt(0).toUpperCase()).join('');
    document.title = `${nombreCompleto} · Generador de nombres`;
    $('#detalle').hidden = false;

    $('#copiar').addEventListener('click', copiarEnlace);
    $('#compartir').addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: nombreCompleto, url: location.href });
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
