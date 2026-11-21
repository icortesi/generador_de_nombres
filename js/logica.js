// Lógica pura del generador: sin DOM, para poder probarla aparte.

// Partículas que no cuentan como apellido ni para iniciales del RFC.
const PARTICULAS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'mc', 'mac', 'van', 'von', 'da', 'das', 'di', 'der']);

// Primeros nombres que el SAT se salta cuando hay un segundo nombre.
const NOMBRES_COMUNES = new Set(['MARIA', 'MA', 'MA.', 'JOSE', 'J', 'J.']);

// Palabras inconvenientes del SAT: la última letra se cambia por X.
const PALABRAS_INCONVENIENTES = new Set((
    'BACA BAKA BUEI BUEY CACA CACO CAGA CAGO CAKA CAKO COGE COGI COJA COJE COJI COJO COLA CULO ' +
    'FALO FETO GETA GUEI GUEY JETA JOTO KACA KACO KAGA KAGO KAKA KAKO KOGE KOGI KOJA KOJE KOJI ' +
    'KOJO KOLA KULO LILO LOCA LOCO LOKA LOKO MAME MAMO MEAR MEAS MEON MIAR MION MOCO MOKO MULA ' +
    'MULO NACA NACO PEDA PEDO PENE PIPI PITO POPO PUTA PUTO QULO RATA ROBA ROBE ROBO RUIN SENO ' +
    'TETA VACA VAGA VAGO VAKA VUEI VUEY WUEI WUEY'
).split(' '));

/** Quita acentos y deja mayúsculas; la Ñ se vuelve X como pide el SAT. */
export function normalizar(texto) {
    return texto
        .toUpperCase()
        .replace(/Ñ/g, 'X')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
}

/** Separa el texto de apellidos en palabras, sin espacios de sobra. */
export function separarApellidos(texto) {
    return texto.trim().split(/\s+/).filter(Boolean);
}

/** Apellidos "útiles" (sin partículas como "de la"). */
function apellidosSinParticulas(apellidos) {
    return apellidos.filter(a => !PARTICULAS.has(a.toLowerCase()));
}

/** Iniciales: primera letra de cada nombre y apellido (sin partículas). */
export function iniciales(nombres, apellidos) {
    return [...nombres, ...apellidosSinParticulas(apellidos)]
        .map(p => p.charAt(0).toUpperCase())
        .join('');
}

/** Primera vocal después de la primera letra, o X si no hay. */
function primeraVocalInterna(palabra) {
    const encontrada = palabra.slice(1).match(/[AEIOU]/);
    return encontrada ? encontrada[0] : 'X';
}

/**
 * Las 4 letras iniciales del RFC de persona física (reglas simplificadas del SAT).
 * Con un solo apellido: dos letras del apellido + dos del nombre.
 */
export function letrasRfc(nombres, apellidos) {
    const ap = apellidosSinParticulas(apellidos).map(normalizar);
    let noms = nombres.map(normalizar);
    if (noms.length > 1 && NOMBRES_COMUNES.has(noms[0])) noms = noms.slice(1);
    const nombre = noms[0] || 'X';

    let letras;
    if (ap.length === 0) {
        letras = 'XX' + nombre.slice(0, 2).padEnd(2, 'X');
    } else if (ap.length === 1) {
        letras = ap[0].slice(0, 2).padEnd(2, 'X') + nombre.slice(0, 2).padEnd(2, 'X');
    } else {
        const paterno = ap[0];
        letras = paterno.charAt(0) + primeraVocalInterna(paterno) + ap[1].charAt(0) + nombre.charAt(0);
    }
    if (PALABRAS_INCONVENIENTES.has(letras)) letras = letras.slice(0, 3) + 'X';
    return letras;
}

/** Fecha en formato AAMMDD. */
export function fechaRfc(fecha) {
    const aa = String(fecha.getFullYear()).slice(-2);
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    return aa + mm + dd;
}

/** RFC sin homoclave. */
export function rfc(nombres, apellidos, fecha) {
    return letrasRfc(nombres, apellidos) + fechaRfc(fecha);
}

/** Suma meses sin "brincar" de mes (31 de mayo + 9 meses = 28/29 de febrero). */
export function sumarMeses(fecha, meses) {
    const resultado = new Date(fecha.getFullYear(), fecha.getMonth() + meses, 1);
    const ultimoDia = new Date(resultado.getFullYear(), resultado.getMonth() + 1, 0).getDate();
    resultado.setDate(Math.min(fecha.getDate(), ultimoDia));
    return resultado;
}

/** Elige `cantidad` elementos distintos al azar, sin repetir los de `excluir`. */
export function elegirAleatorios(lista, cantidad, excluir = [], azar = Math.random) {
    const disponibles = lista.filter(n => !excluir.includes(n));
    const elegidos = [];
    for (let i = 0; i < cantidad && disponibles.length; i++) {
        const indice = Math.floor(azar() * disponibles.length);
        elegidos.push(disponibles.splice(indice, 1)[0]);
    }
    return elegidos;
}

/** Lista de nombres según el género elegido ("nina", "nino" o "sorpresa"). */
export function nombresPorGenero(datos, genero) {
    if (genero === 'nina') return datos.nombresMujer;
    if (genero === 'nino') return datos.nombresHombre;
    return [...datos.nombresMujer, ...datos.nombresHombre];
}

// ---------- Enlaces para compartir (sin persistencia: todo va en la URL) ----------
//
// Formato: share?n=Sofía-Elena&a=Cortés-López  (n = nombres, a = apellidos)
// Las palabras se separan con guion y las letras (con tildes y Ñ) van tal cual,
// así el enlace se lee bien. Los navegadores codifican lo necesario al abrirlo.
// Se sigue aceptando el formato anterior: share?name=["Sofía","Elena","Cortés","López"].

const MAX_PALABRAS = 8;
const MAX_LARGO_PALABRA = 40;

/** Codifica solo lo que no sea letra o número (el guion es el separador). */
const codificarPalabra = palabra =>
    palabra.replace(/[^\p{L}\p{N}]/gu, c => encodeURIComponent(c).replace(/-/g, '%2D'));

/** URL legible de la página de detalle. */
export function enlaceCompartir(base, nombres, apellidos = []) {
    const url = new URL('share', base);
    let consulta = `?n=${nombres.map(codificarPalabra).join('-')}`;
    if (apellidos.length) consulta += `&a=${apellidos.map(codificarPalabra).join('-')}`;
    return url.origin + url.pathname + consulta;
}

function limpiar(palabras) {
    const limpias = palabras
        .filter(p => typeof p === 'string')
        .map(p => p.trim().replace(/\s+/g, ' '))
        .filter(p => p.length > 0 && p.length <= MAX_LARGO_PALABRA);
    return limpias.length === palabras.length ? limpias : null;
}

/**
 * Lee y valida el nombre de la URL. Devuelve { nombres, apellidos } o null si no
 * es válido (no confiamos en lo que venga en un enlace).
 */
export function leerNombreCompartido(search) {
    const params = new URLSearchParams(search);
    let nombres;
    let apellidos = [];

    if (params.has('n')) {
        nombres = limpiar(params.get('n').split('-'));
        if (params.get('a')) apellidos = limpiar(params.get('a').split('-'));
    } else if (params.has('name')) {
        // Formato anterior: un array JSON con nombres y apellidos juntos.
        try {
            const valor = JSON.parse(params.get('name'));
            nombres = Array.isArray(valor) ? limpiar(valor) : null;
        } catch {
            nombres = null;
        }
    }

    if (!nombres || !apellidos || nombres.length === 0) return null;
    if (nombres.length + apellidos.length > MAX_PALABRAS) return null;
    return { nombres, apellidos };
}
