import {
    separarApellidos, iniciales, rfc, sumarMeses, elegirAleatorios, nombresPorGenero, enlaceCompartir,
} from './logica.js';

const MAX_GENERADOS = 100;
const INTENTOS_SIN_REPETIR = 25;
const CLAVE_ESTADO = 'generador-nombres:v2';

const $ = selector => document.querySelector(selector);

const elementos = {
    formulario: $('#formulario'),
    apellidos: $('#apellidos'),
    fecha: $('#fecha'),
    errorGenero: $('#error-genero'),
    errorApellidos: $('#error-apellidos'),
    listas: { generados: $('#lista-generados'), favoritos: $('#lista-favoritos') },
    vacios: { generados: $('#vacio-generados'), favoritos: $('#vacio-favoritos') },
    tabs: { generados: $('#tab-generados'), favoritos: $('#tab-favoritos') },
    contadores: { generados: $('#contador-generados'), favoritos: $('#contador-favoritos') },
    plantilla: $('#plantilla-tarjeta'),
    aviso: $('#aviso'),
};

let datos = null;
let estado = {
    generados: [],
    favoritos: [],
    vista: 'generados',
    preferencias: {},
};

// ---------- Persistencia (siempre tolerante a fallos) ----------

function guardar() {
    try {
        localStorage.setItem(CLAVE_ESTADO, JSON.stringify(estado));
    } catch { /* modo privado o almacenamiento lleno: la app sigue funcionando */ }
}

function cargar() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_ESTADO));
        if (guardado) estado = { ...estado, ...guardado };
    } catch { /* ignorar */ }
}

// ---------- Utilidades ----------

const fechaAInput = f => `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;

function inputAFecha(valor) {
    const [a, m, d] = (valor || '').split('-').map(Number);
    return a && m && d ? new Date(a, m - 1, d) : sumarMeses(new Date(), 9);
}

const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clave = r => [...r.nombres, ...r.apellidos].join(' ').toLowerCase();

function textoDe(resultado) {
    const nombreCompleto = [...resultado.nombres, ...resultado.apellidos].join(' ');
    const fecha = inputAFecha(resultado.fecha);
    return `${nombreCompleto} (iniciales ${iniciales(resultado.nombres, resultado.apellidos)}, ` +
        `RFC ${rfc(resultado.nombres, resultado.apellidos, fecha)})`;
}

let temporizadorAviso;
function avisar(mensaje) {
    elementos.aviso.textContent = mensaje;
    elementos.aviso.classList.add('visible');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => elementos.aviso.classList.remove('visible'), 2200);
}

async function copiarTexto(texto, mensaje = '¡Copiado! 📋') {
    try {
        await navigator.clipboard.writeText(texto);
    } catch {
        // Respaldo para navegadores sin la API moderna
        const area = document.createElement('textarea');
        area.value = texto;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
    }
    avisar(mensaje);
}

const enlaceDe = resultado => enlaceCompartir(location.href, [...resultado.nombres, ...resultado.apellidos]);

async function compartirEnlace(resultado) {
    const url = enlaceDe(resultado);
    if (navigator.share) {
        try {
            await navigator.share({ title: [...resultado.nombres, ...resultado.apellidos].join(' '), url });
            return;
        } catch (error) {
            if (error.name === 'AbortError') return;
        }
    }
    await copiarTexto(url, '¡Enlace copiado! 🔗');
}

async function compartirTexto(texto) {
    if (navigator.share) {
        try {
            await navigator.share({ title: 'Ideas de nombres 👶', text: texto });
            return;
        } catch (error) {
            if (error.name === 'AbortError') return; // la persona canceló
        }
    }
    await copiarTexto(texto);
}

// ---------- Generación ----------

function leerFormulario() {
    const genero = elementos.formulario.genero.value;
    const cantidad = Number(elementos.formulario.cantidad.value) || 2;
    const apellidos = separarApellidos(elementos.apellidos.value);
    const fecha = elementos.fecha.value;

    elementos.errorGenero.hidden = Boolean(genero);
    elementos.errorApellidos.hidden = apellidos.length > 0;
    elementos.apellidos.toggleAttribute('aria-invalid', apellidos.length === 0);

    if (!genero || apellidos.length === 0) {
        (!genero ? elementos.formulario.querySelector('[name=genero]') : elementos.apellidos).focus();
        return null;
    }
    return { genero, cantidad, apellidos, fecha };
}

function generar() {
    if (!datos) return;
    const entrada = leerFormulario();
    if (!entrada) return;

    estado.preferencias = {
        genero: entrada.genero, cantidad: entrada.cantidad,
        apellidos: elementos.apellidos.value.trim(), fecha: entrada.fecha,
    };

    const yaVistos = new Set(estado.generados.map(clave));
    let resultado;
    for (let intento = 0; intento < INTENTOS_SIN_REPETIR; intento++) {
        // En "Sorpresa" se elige el género por combinación, para no mezclar listas.
        const genero = entrada.genero === 'sorpresa' ? (Math.random() < 0.5 ? 'nina' : 'nino') : entrada.genero;
        resultado = {
            id: nuevoId(),
            genero,
            nombres: elegirAleatorios(nombresPorGenero(datos, genero), entrada.cantidad),
            apellidos: entrada.apellidos,
            fecha: entrada.fecha,
        };
        if (!yaVistos.has(clave(resultado))) break;
    }

    estado.generados.unshift(resultado);
    estado.generados = estado.generados.slice(0, MAX_GENERADOS);
    cambiarVista('generados');
    guardar();
    pintar(resultado.id);
    // En móvil el formulario queda arriba: llevamos la vista al nombre nuevo.
    elementos.listas.generados.firstElementChild?.scrollIntoView({
        block: 'nearest',
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
}

function cambiarNombre(resultado, indice) {
    const lista = nombresPorGenero(datos, resultado.genero);
    const [nuevo] = elegirAleatorios(lista, 1, resultado.nombres);
    if (!nuevo) return;
    resultado.nombres = resultado.nombres.map((n, i) => (i === indice ? nuevo : n));
    guardar();
    pintar(resultado.id);
}

function alternarFavorito(resultado) {
    const indice = estado.favoritos.findIndex(f => clave(f) === clave(resultado));
    if (indice >= 0) {
        estado.favoritos.splice(indice, 1);
        avisar('Quitado de favoritos');
    } else {
        estado.favoritos.unshift({ ...resultado, nombres: [...resultado.nombres] });
        avisar('Guardado en favoritos ❤️');
    }
    guardar();
    pintar();
}

// ---------- Pintado ----------

function crearTarjeta(resultado, enFavoritos) {
    const tarjeta = elementos.plantilla.content.firstElementChild.cloneNode(true);
    const contenedorNombres = tarjeta.querySelector('.nombres');

    resultado.nombres.forEach((nombre, indice) => {
        if (enFavoritos) {
            const span = document.createElement('span');
            span.className = 'nombre';
            span.textContent = nombre;
            contenedorNombres.append(span, ' ');
        } else {
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'nombre cambiable';
            boton.textContent = nombre;
            boton.setAttribute('aria-label', `Cambiar ${nombre} por otro nombre`);
            boton.title = 'Toca para cambiar solo este nombre';
            boton.addEventListener('click', () => cambiarNombre(resultado, indice));
            contenedorNombres.append(boton, ' ');
        }
    });
    tarjeta.querySelector('.apellidos').textContent = resultado.apellidos.join(' ');

    const fecha = inputAFecha(resultado.fecha);
    tarjeta.querySelector('.detalles').textContent =
        `Iniciales ${iniciales(resultado.nombres, resultado.apellidos)} · RFC ${rfc(resultado.nombres, resultado.apellidos, fecha)}`;

    const esFavorito = estado.favoritos.some(f => clave(f) === clave(resultado));
    const corazon = tarjeta.querySelector('.favorito');
    corazon.textContent = esFavorito ? '♥' : '♡';
    corazon.setAttribute('aria-pressed', String(esFavorito));
    corazon.setAttribute('aria-label', esFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos');
    corazon.addEventListener('click', () => alternarFavorito(resultado));

    tarjeta.querySelector('.compartir-uno').addEventListener('click', () => compartirEnlace(resultado));
    return tarjeta;
}

function pintar(idNuevo) {
    for (const vista of ['generados', 'favoritos']) {
        const lista = elementos.listas[vista];
        const enFavoritos = vista === 'favoritos';
        lista.replaceChildren(...estado[vista].map(r => {
            const tarjeta = crearTarjeta(r, enFavoritos);
            if (r.id === idNuevo && !enFavoritos) tarjeta.classList.add('nueva');
            return tarjeta;
        }));
        elementos.contadores[vista].textContent = estado[vista].length;
        const activa = estado.vista === vista;
        lista.hidden = !activa;
        elementos.vacios[vista].hidden = !activa || estado[vista].length > 0;
        elementos.tabs[vista].setAttribute('aria-selected', String(activa));
    }
    const hayAlgo = estado[estado.vista].length > 0;
    for (const id of ['#compartir', '#copiar', '#limpiar']) $(id).disabled = !hayAlgo;
}

function cambiarVista(vista) {
    estado.vista = vista;
    guardar();
    pintar();
}

// ---------- Eventos ----------

elementos.formulario.addEventListener('submit', evento => {
    evento.preventDefault(); // Enter ya no recarga la página: genera un nombre.
    generar();
});

elementos.formulario.addEventListener('change', evento => {
    if (evento.target.name === 'genero') elementos.errorGenero.hidden = true;
});
elementos.apellidos.addEventListener('input', () => {
    elementos.errorApellidos.hidden = true;
    elementos.apellidos.removeAttribute('aria-invalid');
});

elementos.tabs.generados.addEventListener('click', () => cambiarVista('generados'));
elementos.tabs.favoritos.addEventListener('click', () => cambiarVista('favoritos'));

const textoVistaActual = () => estado[estado.vista].map(textoDe).join('\n');
$('#copiar').addEventListener('click', () => copiarTexto(textoVistaActual()));
$('#compartir').addEventListener('click', () => compartirTexto(textoVistaActual()));
$('#limpiar').addEventListener('click', () => {
    const vista = estado.vista;
    const respaldo = estado[vista];
    estado[vista] = [];
    guardar();
    pintar();
    mostrarDeshacer(vista, respaldo);
});

function mostrarDeshacer(vista, respaldo) {
    elementos.aviso.replaceChildren(
        document.createTextNode(vista === 'favoritos' ? 'Favoritos borrados ' : 'Lista limpia '),
    );
    const deshacer = document.createElement('button');
    deshacer.type = 'button';
    deshacer.className = 'deshacer';
    deshacer.textContent = 'Deshacer';
    deshacer.addEventListener('click', () => {
        estado[vista] = respaldo;
        guardar();
        pintar();
        elementos.aviso.classList.remove('visible');
    });
    elementos.aviso.append(deshacer);
    elementos.aviso.classList.add('visible');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => elementos.aviso.classList.remove('visible'), 5000);
}

// ---------- Arranque ----------

function restaurarFormulario() {
    const p = estado.preferencias || {};
    if (p.genero) {
        const radio = elementos.formulario.querySelector(`[name=genero][value="${p.genero}"]`);
        if (radio) radio.checked = true;
    }
    if (p.cantidad) {
        const radio = elementos.formulario.querySelector(`[name=cantidad][value="${p.cantidad}"]`);
        if (radio) radio.checked = true;
    }
    if (p.apellidos) elementos.apellidos.value = p.apellidos;
    elementos.fecha.value = p.fecha || fechaAInput(sumarMeses(new Date(), 9));
}

cargar();
restaurarFormulario();
pintar();

fetch('nombres.json')
    .then(respuesta => {
        if (!respuesta.ok) throw new Error(respuesta.status);
        return respuesta.json();
    })
    .then(json => { datos = json; })
    .catch(() => {
        $('#generar').disabled = true;
        avisar('No pude cargar la lista de nombres. Recarga la página, porfa.');
    });
