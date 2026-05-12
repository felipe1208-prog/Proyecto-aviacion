document.addEventListener("DOMContentLoaded", () => {
    if(typeof aplicarFondo === 'function') aplicarFondo();

    // Configurar fechas mínimas a HOY para evitar fechas pasadas visualmente
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const hoyLocal = (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];
    document.getElementById('fechaIda').min = hoyLocal;
    document.getElementById('fechaRegreso').min = hoyLocal;

    // Mostrar u ocultar Fecha de Regreso ---
    const radiosTipoViaje = document.querySelectorAll('input[name="tipoViaje"]');
    const grupoFechaRegreso = document.getElementById('grupoFechaRegreso');
    const inputFechaRegreso = document.getElementById('fechaRegreso'); 

    radiosTipoViaje.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'ida y vuelta') {
                grupoFechaRegreso.classList.remove('oculto');
                inputFechaRegreso.required = true; 
            } else {
                grupoFechaRegreso.classList.add('oculto');
                inputFechaRegreso.required = false; 
                inputFechaRegreso.value = ""; 
            }
        });
    });
});

// 1. FUNCIÓN PARA PASAR AL PASO 2 (Generar Pasajeros)
function avanzarAPasajeros() {
    const origen = document.getElementById('origen');
    const destino = document.getElementById('destino');
    const fechaIda = document.getElementById('fechaIda');
    const fechaRegreso = document.getElementById('fechaRegreso');
    const tipoViaje = document.querySelector('input[name="tipoViaje"]:checked').value;

    // Validar campos vacíos
    if (origen.value.trim() === "") { alert("Por favor, ingresa la ciudad de Origen."); origen.focus(); return; }
    if (destino.value.trim() === "") { alert("Por favor, ingresa la ciudad de Destino."); destino.focus(); return; }
    if (fechaIda.value === "") { alert("Por favor, selecciona la Fecha de Ida."); fechaIda.focus(); return; }
    
    // Validar Origen distinto de Destino
    if (origen.value.trim().toLowerCase() === destino.value.trim().toLowerCase()) {
        alert("El Origen y el Destino no pueden ser iguales.");
        return;
    }

    // Validar fechas pasadas y coherencia en viaje de regreso
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const hoyLocal = (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];
    
    if (fechaIda.value < hoyLocal) {
        alert("La fecha de ida no puede ser una fecha pasada.");
        return;
    }

    if (tipoViaje === 'ida y vuelta') {
        if (fechaRegreso.value === "") {
            alert("Por favor, selecciona la Fecha de Regreso."); fechaRegreso.focus(); return;
        }
        if (fechaRegreso.value <= fechaIda.value) {
            alert("La fecha de regreso debe ser estrictamente mayor a la fecha de ida.");
            fechaRegreso.focus();
            return;
        }
    }

    const adultos = parseInt(document.getElementById('cantAdultos').value);
    const menores = parseInt(document.getElementById('cantMenores').value);
    const mayores = parseInt(document.getElementById('cantMayores').value);
    const contenedor = document.getElementById('contenedor-formularios-dinamicos');
    
    contenedor.innerHTML = '';

    for (let i = 1; i <= adultos; i++) { generarPasajero('molde-adulto', i, contenedor, i === 1); }
    for (let i = 1; i <= menores; i++) { generarPasajero('molde-menor', adultos + i, contenedor, false); }
    for (let i = 1; i <= mayores; i++) { generarPasajero('molde-mayor', adultos + menores + i, contenedor, false); }

    const totalPasajeros = adultos + menores + mayores;
    crearPaginacion(totalPasajeros);
    mostrarPasajero(1);

    document.getElementById('paso-1-vuelo').classList.add('oculto');
    document.getElementById('paso-2-pasajeros').classList.remove('oculto');
    document.getElementById('formularioReserva').scrollTop = 0;
}

// 2. FUNCIÓN PARA CLONAR EL MOLDE
function generarPasajero(idMolde, numero, contenedor, esPrincipal) {
    const molde = document.getElementById(idMolde);
    const clon = molde.content.cloneNode(true);

    clon.querySelector('.num-pasajero').textContent = numero;

    if (!esPrincipal) {
        const contacto = clon.querySelector('.contenedor-contacto');
        if (contacto) contacto.classList.add('oculto');
    }

    // Filtros para asegurar que los campos sean SOLO NÚMEROS
    const inputNumDoc = clon.querySelector('.input-num-doc');
    if (inputNumDoc) {
        inputNumDoc.addEventListener('input', function() {
            if (!this.readOnly) {
                this.value = this.value.replace(/\D/g, ''); 
            }
        });
    }

    const inputTelefono = clon.querySelector('.input-telefono');
    if (inputTelefono) {
        inputTelefono.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, ''); 
        });
    }

    // NUEVO: Filtros para asegurar que nombres y apellidos sean SOLO LETRAS
    const inputNombre = clon.querySelector('.input-nombre');
    const inputApellido = clon.querySelector('.input-apellido');
    
    const filtroLetras = function() {
        // Expresión regular que borra todo lo que NO sea letra, acento, ñ o espacio
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    };

    if (inputNombre) inputNombre.addEventListener('input', filtroLetras);
    if (inputApellido) inputApellido.addEventListener('input', filtroLetras);

    // Embarazo
    const selectGenero = clon.querySelector('.input-genero');
    const divEmbarazo = clon.querySelector('.contenedor-embarazo');
    const radiosEmbarazo = clon.querySelectorAll('.contenedor-embarazo input[type="radio"]');
    radiosEmbarazo.forEach(radio => radio.name = `embarazo_pasajero_${numero}`);

    if (selectGenero && divEmbarazo) {
        selectGenero.addEventListener('change', function() {
            if (this.value === 'femenino') divEmbarazo.classList.remove('oculto');
            else divEmbarazo.classList.add('oculto');
        });
    }

    const inputFecha = clon.querySelector('.input-fecha-nac');
    const inputEdad = clon.querySelector('.input-edad');

    // NUEVO: Bloquear el calendario para que no puedan elegir fechas futuras
    if (inputFecha) {
        const tzOffset = (new Date()).getTimezoneOffset() * 60000;
        const hoyLocal = (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];
        inputFecha.max = hoyLocal; 
    }

    if (inputFecha && inputEdad) {
        inputFecha.addEventListener('change', function() {
            if(this.value) {
                const edadCalculada = calcularEdad(this.value);
                let esValido = true;
                let mensajeError = "";
                
                const bloqueActual = this.closest('.pasajero-bloque');

                // NUEVO: Validación estricta de edad negativa por si burlan el calendario
                if (edadCalculada < 0) {
                    esValido = false; 
                    mensajeError = "La edad no puede ser negativa. Por favor, ingresa una fecha de nacimiento válida.";
                } else if (idMolde === 'molde-adulto') {
                    if (edadCalculada < 13 || edadCalculada >= 65) {
                        esValido = false; mensajeError = "Un adulto debe tener entre 13 y 64 años.";
                    }
                } else if (idMolde === 'molde-menor') {
                    if (edadCalculada > 12) {
                        esValido = false; mensajeError = "Un menor debe tener 12 años o menos.";
                    } else {
                        // REGLA: Menor de 9 años -> Partida de nacimiento obligatoria
                        const selectDoc = bloqueActual.querySelector('.input-tipo-doc');
                        const docCaja = bloqueActual.querySelector('.input-num-doc');
                        
                        if (selectDoc && docCaja) {
                            if (edadCalculada < 9) {
                                selectDoc.value = 'partida';
                                Array.from(selectDoc.options).forEach(opt => {
                                    if (opt.value !== 'partida') opt.disabled = true;
                                });
                                docCaja.value = 'Llevar partida de nacimiento al aeropuerto';
                                docCaja.readOnly = true;
                                docCaja.type = 'text'; 
                            } else {
                                Array.from(selectDoc.options).forEach(opt => opt.disabled = false);
                                if (docCaja.value === 'Llevar partida de nacimiento al aeropuerto') {
                                    docCaja.value = '';
                                }
                                docCaja.readOnly = false;
                            }
                        }
                    }
                } else if (idMolde === 'molde-mayor') {
                    if (edadCalculada < 65) {
                        esValido = false; mensajeError = "Un pasajero de tercera edad debe tener 65 años o más.";
                    }
                }

                if (esValido) {
                    inputEdad.value = edadCalculada + " años";
                } else {
                    alert(mensajeError); 
                    this.value = "";     
                    inputEdad.value = ""; 
                }
            } else {
                inputEdad.value = "";
            }
        });
    }
    contenedor.appendChild(clon);
}

function volverAPaso1() {
    document.getElementById('paso-2-pasajeros').classList.add('oculto');
    document.getElementById('paso-1-vuelo').classList.remove('oculto');
}

function modificarContador(idInput, cambio) {
    const input = document.getElementById(idInput);
    let nuevoValor = parseInt(input.value) + cambio;
    if (nuevoValor >= parseInt(input.min)) input.value = nuevoValor;
}

// Carga Cartelera
document.addEventListener('DOMContentLoaded', () => {
    const query = new URLSearchParams(window.location.search);
    const ruta = query.get('ruta');
    const fecha = query.get('fecha');

    const campoOrgien = document.getElementById('origen');
    const campoDestino = document.getElementById('destino');
    const campoFecha = document.getElementById('fechaIda');

    function formatearFecha(fechaTexto) {
        const meses = {
            'ene': '01', 'enero': '01', 'feb': '02', 'febrero': '02',
            'mar': '03', 'marzo': '03', 'abr': '04', 'abril': '04',
            'may': '05', 'mayo': '05', 'jun': '06', 'junio': '06',
            'jul': '07', 'julio': '07', 'ago': '08', 'agosto': '08',
            'sep': '09', 'septiembre': '09', 'oct': '10', 'octubre': '10',
            'nov': '11', 'noviembre': '11', 'dic': '12', 'diciembre': '12'
        };
        const soloFecha = fechaTexto.split(',')[0].trim();
        const partes = soloFecha.toLowerCase().split(' ');
        if (partes.length === 3) return `${partes[2]}-${meses[partes[1]] || '01'}-${partes[0].padStart(2, '0')}`;
        return fechaTexto; 
    }

    if (ruta && fecha && campoOrgien && campoDestino && campoFecha) {
        const partesRuta = ruta.split('-');
        campoOrgien.value = partesRuta[0].trim();
        campoDestino.value = partesRuta[1].trim();
        campoFecha.value = formatearFecha(fecha);
        campoDestino.readOnly = true;
        campoOrgien.readOnly = true;
        campoFecha.readOnly = true;
    } else {
        localStorage.removeItem('estadoVueloActual');
    }
});

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento + 'T00:00:00');
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const diferenciaMeses = hoy.getMonth() - fechaNac.getMonth();
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad;
}

const btnContinuarFinal = document.getElementById('btnContinuar');

// --- VALIDACIONES FINALES ANTES DE ELEGIR ASIENTOS ---
btnContinuarFinal.addEventListener('click', () => {
    const bloquesPasajeros = document.querySelectorAll('.pasajero-bloque');
    let listaPasajeros = [];
    
    let contEconomica = 0;
    let contTurista = 0;
    let claseAdultoPrincipal = "";

    for (let i = 0; i < bloquesPasajeros.length; i++) {
        const b = bloquesPasajeros[i];
        const val = (clase) => b.querySelector(clase)?.value.trim() || "";
        
        const nombre = val('.input-nombre');
        const apellido = val('.input-apellido');
        const doc = val('.input-num-doc');
        const clase = val('.input-clase-vuelo') || "turista";
        const esMenor = b.querySelector('.titulo-menor') !== null;

        // Memorizamos la clase del Pasajero 1 (Siempre será el adulto principal)
        if (i === 0) claseAdultoPrincipal = clase;

        // Validamos que el menor viaje en la misma clase
        if (esMenor && clase !== claseAdultoPrincipal) {
            mostrarPasajero(i + 1); 
            alert(`El menor (Pasajero ${i + 1}) debe viajar obligatoriamente en la misma clase que el adulto principal (${claseAdultoPrincipal.toUpperCase()}).`);
            return;
        }

        // Contamos sillas
        if (clase === 'economica') contEconomica++;
        else contTurista++;

        // Validamos que TODO el formulario esté lleno (Incluso Contacto si aplica)
        if (!nombre || !apellido || !val('.input-fecha-nac') || !val('.input-edad') || !doc) {
            mostrarPasajero(i + 1); 
            alert(`Por favor, completa todos los datos obligatorios del Pasajero ${i + 1} para continuar.`);
            return; 
        }

        const contacto = b.querySelector('.contenedor-contacto');
        if (contacto && !contacto.classList.contains('oculto')) {
            const correo = val('.input-correo');
            const telefono = val('.input-telefono');
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

            if (!correo || !regexCorreo.test(correo)) {
                mostrarPasajero(i + 1);
                alert("Por favor, ingresa un correo electrónico válido para el Pasajero principal.");
                return;
            }
            if (!telefono || telefono.length < 10) {
                mostrarPasajero(i + 1);
                alert("Por favor, ingresa un número de teléfono válido (mínimo 10 dígitos).");
                return;
            }
        }

        listaPasajeros.push({
            id: `${i + 1}${clase === 'economica' ? 'E' : 'T'}`,
            nombreCompleto: `${nombre} ${apellido}`,
            documentoId: doc,
            tipoClase: clase,
            noPuedeEmergencia: esMenor || b.textContent.includes('Tercera edad') || b.querySelector('.input-discapacidad')?.checked || b.querySelector('.radio-emb-si')?.checked
        });
    }

    // Validamos límites de asientos del Avión
    if (contEconomica > 8) {
        alert(`Límite excedido: Solo hay 8 asientos disponibles en clase Económica (Has solicitado ${contEconomica}).`);
        return;
    }
    
    if (contTurista > 120) {
        alert(`Límite excedido: Solo hay 120 asientos disponibles en clase Turista (Has solicitado ${contTurista}).`);
        return;
    }

    localStorage.setItem('pasajerosVuelo', JSON.stringify(listaPasajeros));
    window.location.href = 'asientos.html';
});

// --- LÓGICA DEL CARRUSEL DE BENEFICIOS ---
let indiceCarrusel = 0; 
function moverCarrusel(direccion) {
    const track = document.getElementById('track-beneficios');
    const tarjetas = track.querySelectorAll('.tarjeta-beneficios');
    const totalTarjetas = tarjetas.length;
    indiceCarrusel += direccion;
    if (indiceCarrusel < 0) indiceCarrusel = 0;
    else if (indiceCarrusel >= totalTarjetas) indiceCarrusel = totalTarjetas - 1;
    const desplazamiento = -(indiceCarrusel * 100); 
    track.style.transform = `translateX(${desplazamiento}%)`;
    actualizarBotonesCarrusel(totalTarjetas);
}

function actualizarBotonesCarrusel(totalTarjetas) {
    const btnIzq = document.getElementById('btn-carrusel-izq');
    const btnDer = document.getElementById('btn-carrusel-der');
    if (indiceCarrusel === 0) btnIzq.style.display = 'none';
    else btnIzq.style.display = 'flex'; 
    if (indiceCarrusel === totalTarjetas - 1) btnDer.style.display = 'none';
    else btnDer.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    const tarjetasCarrusel = document.querySelectorAll('#track-beneficios .tarjeta-beneficios');
    if (tarjetasCarrusel.length > 0) actualizarBotonesCarrusel(tarjetasCarrusel.length);
});

// --- LÓGICA DE PAGINACIÓN MINIMALISTA ---
let pasajeroActual = 1;
let totalPasajerosGlobal = 1;

function crearPaginacion(total) {
    totalPasajerosGlobal = total;
    const contenedor = document.getElementById('paginacion-pasajeros');
    if (!contenedor) return;
    if (total <= 1) { contenedor.innerHTML = ''; return; }
    contenedor.innerHTML = `
        <button type="button" id="pag-atras" class="btn-flecha-pag" onclick="cambiarPasajero(-1)">&#10094;</button>
        <span id="indicador-pagina">1</span>
        <button type="button" id="pag-sig" class="btn-flecha-pag" onclick="cambiarPasajero(1)">&#10095;</button>
    `;
    actualizarInterfazPaginacion();
}

function cambiarPasajero(direccion) {
    const nuevoIndice = pasajeroActual + direccion;
    if (nuevoIndice >= 1 && nuevoIndice <= totalPasajerosGlobal) mostrarPasajero(nuevoIndice);
}

function mostrarPasajero(indice) {
    pasajeroActual = indice;
    const bloques = document.querySelectorAll('.pasajero-bloque');
    bloques.forEach((bloque, i) => {
        if (i + 1 === indice) bloque.classList.remove('oculto');
        else bloque.classList.add('oculto');
    });
    actualizarInterfazPaginacion();
}

function actualizarInterfazPaginacion() {
    const indicador = document.getElementById('indicador-pagina');
    const btnAtras = document.getElementById('pag-atras');
    const btnSig = document.getElementById('pag-sig');
    if (!indicador) return;
    indicador.textContent = pasajeroActual;
    if (pasajeroActual === 1) btnAtras.classList.add('invisible');
    else btnAtras.classList.remove('invisible');
    if (pasajeroActual === totalPasajerosGlobal) btnSig.classList.add('invisible');
    else btnSig.classList.remove('invisible');
}