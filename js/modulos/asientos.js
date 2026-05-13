//f5
const navegacionAsientos = performance.getEntriesByType("navigation")[0];
if (navegacionAsientos && navegacionAsientos.type === "reload") {
    sessionStorage.clear(); 
    window.location.href = 'home.html'; 
}

document.addEventListener("DOMContentLoaded", () => {
    if(typeof aplicarFondo === 'function') aplicarFondo();
});

document.addEventListener('DOMContentLoaded', () => {

    const contenedorFilas = document.querySelector('.contenedor-filas');
    const asientos = document.querySelectorAll('.asiento');
    const btnReservar = document.querySelector('.btn-reservar');

    let pasajeroActivo = null;

    // Local storage traer
    function cargarPasajerosLocalStorage() {
        const datosMochila = sessionStorage.getItem('pasajerosVuelo');

        if (datosMochila) {
            const pasajeros = JSON.parse(datosMochila);
            contenedorFilas.innerHTML = ''; 

            pasajeros.forEach(pasajero => {
                const filaHTML = `
                    <div class="fila-tabla" data-emergencia="${pasajero.noPuedeEmergencia}">
                        <div class="id-boleto">${pasajero.id}</div>
                        <div class="nombre-pasajero">${pasajero.nombreCompleto}</div>
                        <div class="nro-documento">${pasajero.documentoId}</div>
                        <div class="asiento-reservado">
                            <span class="badge-asiento pendiente">--</span>
                        </div>
                    </div>
                `;
                contenedorFilas.innerHTML += filaHTML;
            });
        }
    }

    // Asientos bloqueados aleatorios
    function generarAsientosOcupados(porcentaje) {
        if (porcentaje <= 0) return [];
        const todosLosAsientosDOM = document.querySelectorAll('.asiento');
        const todosLosIDs = Array.from(todosLosAsientosDOM).map(a => a.dataset.asiento);
        const cantidadAOcupar = Math.floor(todosLosIDs.length * (porcentaje/100));
        const asientosMezclados = todosLosIDs.sort(() => 0.5 - Math.random());
        return asientosMezclados.slice(0, cantidadAOcupar);
    }

    function bloquearAsientos(listaAsientosOcupados) {
        listaAsientosOcupados.forEach(numeroAsiento => {
            const asientoDOM = document.querySelector(`.asiento[data-asiento="${numeroAsiento}"]`);
            if (asientoDOM) {
                asientoDOM.classList.add('ocupado');
            }
        });
    }

    // Ejecucion al cargar
    cargarPasajerosLocalStorage();

    const infoVuelo = sessionStorage.getItem('estadoVueloActual');
    let porcentajeOcupacion = 0;

    if (infoVuelo === "En Reserva") porcentajeOcupacion = 15;
    if (infoVuelo === "Próximo a Abordar") porcentajeOcupacion = 50;

    const asientosYaComprados = generarAsientosOcupados(porcentajeOcupacion);
    bloquearAsientos(asientosYaComprados);

    const filasBoletos = document.querySelectorAll('.fila-tabla');

    // Seleccionamos pasajero
    filasBoletos.forEach(fila => {
        fila.addEventListener('click', () => {
            seleccionarPasajero(fila);
        });
    });

    if (filasBoletos.length > 0) {
        seleccionarPasajero(filasBoletos[0]);
    }

    function seleccionarPasajero(filaDOM) {
        filasBoletos.forEach(f => f.classList.remove('boleto-activo'));
        filaDOM.classList.add('boleto-activo');
        pasajeroActivo = filaDOM; 

        const idTexto = filaDOM.querySelector('.id-boleto').textContent.trim();
        const tipoTarifa = idTexto.slice(-1);
        const noPuedeEnEmergencia = filaDOM.dataset.emergencia === "true";
        restringirAsientosPorTarifa(tipoTarifa, noPuedeEnEmergencia);
    }

    function restringirAsientosPorTarifa(tarifa, restriccionEmergencia) {
        const todosLosAsientos = document.querySelectorAll('.asiento');
        const FILAS_EMERGENCIA = [1, 9, 10, 22];

        todosLosAsientos.forEach(asiento => asiento.classList.remove('restringido'));
        
        todosLosAsientos.forEach(asiento => {
            const numAsiento = asiento.dataset.asiento; 
            const fila = parseInt(numAsiento);
            const letra = numAsiento.slice(-1); // ¡CORREGIDO! Faltaba declarar esta variable

            if (tarifa === 'E' && fila >= 3) {
                asiento.classList.add('restringido');
            } else if (tarifa === 'T' && fila <= 2) {
                asiento.classList.add('restringido');
            }

            if (restriccionEmergencia && FILAS_EMERGENCIA.includes(fila)) {
                asiento.classList.add('restringido');
            }

            if (restriccionEmergencia && (letra === 'C' || letra === 'D')) {
                asiento.classList.add('restringido');
            } 
        });
    }

    // Lógica al hacer clic en un asiento del avión
    asientos.forEach(asiento => {
        asiento.addEventListener('click', () => {
            if (asiento.classList.contains('ocupado')) return;
            if (asiento.classList.contains('restringido')) return; 
            
            if (!pasajeroActivo) {
                alert("Por favor, selecciona un pasajero de la lista para asignarle este asiento.");
                return; 
            }
            if (asiento.classList.contains('seleccionado')) return;

            const numeroAsiento = asiento.dataset.asiento;
            const fila = parseInt(numeroAsiento); // Ej: Convierte "10B" a 10

            // =======================================================
            // NUEVO: LA TRAMPA PARA LA FILA DE EMERGENCIA
            // =======================================================
            if (fila === 9 || fila === 11 || fila === 22 || fila === 1) {
                // Guardamos el asiento temporalmente
                asientoPendienteDOM = asiento;
                numAsientoPendiente = numeroAsiento;
                
                // Disparamos la ventana modal
                document.getElementById('modal-emergencia').classList.add('activo');
            } else {
                // Si es cualquier otra fila normal, lo asignamos de una vez
                ejecutarAsignacionAsiento(asiento, numeroAsiento);
            }
            // =======================================================
        });
    });

    function autoSeleccionarSiguiente() {
        const siguienteFilaLibre = Array.from(filasBoletos).find(f => {
            return f.querySelector('.badge-asiento').textContent.trim() === '--';
        });

        if (siguienteFilaLibre) {
            seleccionarPasajero(siguienteFilaLibre);
        } else {
            filasBoletos.forEach(f => f.classList.remove('boleto-activo'));
            pasajeroActivo = null;
        }
    }

    function validarBotonConfirmar() {
        const listos = Array.from(filasBoletos).every(f => {
            const asiento = f.querySelector('.badge-asiento').textContent.trim();
            return asiento !== '--' && asiento !== '';
        });

        if (listos) {
            btnReservar.disabled = false;
        } else {
            btnReservar.disabled = true;
        }
    }

    let asientoPendienteDOM = null;
    let numAsientoPendiente = "";

    function crearModalEmergencia() {
        if (document.getElementById('modal-emergencia')) return;
        const modalHTML = `
            <div id="modal-emergencia" class="modal-overlay">
                <div class="modal-contenido" style="text-align: center;">
                    <h3 class="modal-titulo">Salida de Emergencia</h3>
                    
                    <div class="modal-texto">
                        <p style="margin-bottom: 15px;">Al sentarte aquí, confirmas que estás dispuesto y eres capaz de:</p>
                        <p><strong>1. Asistencia:</strong> Ayudar a la tripulación en caso de una evacuación.</p>
                        <p><strong>2. Capacidad Física:</strong> Tener la fuerza para manipular la puerta de emergencia (aprox. 15kg).</p>
                        <p><strong>3. Comprensión:</strong> Seguir instrucciones de seguridad verbales y escritas de la tripulación.</p>
                        <p style="margin-top: 15px; font-weight: bold; color: #555;">Si no cumples con estos requisitos, por favor elige otro asiento.</p>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button id="btn-cancelar-em" class="btn-confirmar" style="background: transparent; color: #f2a65a; border: 2px solid #f2a65a; box-shadow: none;">ELEGIR OTRO</button>
                        <button id="btn-aceptar-em" class="btn-confirmar">ACEPTO</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    crearModalEmergencia();

    const modalEmergencia = document.getElementById('modal-emergencia');
    
    document.getElementById('btn-cancelar-em').addEventListener('click', () => {
        modalEmergencia.classList.remove('activo');
        asientoPendienteDOM = null;
        numAsientoPendiente = "";
    });

    document.getElementById('btn-aceptar-em').addEventListener('click', () => {
        modalEmergencia.classList.remove('activo');
        if (asientoPendienteDOM && numAsientoPendiente) {
            ejecutarAsignacionAsiento(asientoPendienteDOM, numAsientoPendiente);
        }
    });

    function ejecutarAsignacionAsiento(asientoDOM, numeroAsiento) {
        const badgeAsiento = pasajeroActivo.querySelector('.badge-asiento');
        const asientoViejo = badgeAsiento.textContent.trim();

        if (asientoViejo !== "--" && asientoViejo !== "") {
            const asientoDOMViejo = document.querySelector(`.asiento[data-asiento="${asientoViejo}"]`);
            if (asientoDOMViejo) asientoDOMViejo.classList.remove('seleccionado');
        }
        
        asientoDOM.classList.add('seleccionado');
        badgeAsiento.textContent = numeroAsiento;
        badgeAsiento.classList.remove('pendiente');
        badgeAsiento.classList.add('reservado'); 
        
        autoSeleccionarSiguiente();
        validarBotonConfirmar();
    }

    // 1. Función que crea e inyecta la modal de éxito en el HTML
    function crearModalExito() {
        if (document.getElementById('modal-exito')) return;
        const modalHTML = `
            <div id="modal-exito" class="modal-overlay">
                <div class="modal-contenido" style="text-align: center;">
                    <h3 class="modal-titulo2">Reservación Exitosa</h3>
                    <div class="modal-texto2">
                        <p>Tus asientos han sido asignados correctamente.</p>
                        <p>¡Gracias por elegir OS Airlines!. Puedes ver tus boletos en el apartado de "Boletos".</p>
                    </div>
                    <button id="btn-volver-inicio" class="btn-confirmar">Volver al Inicio</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 2. Construimos la modal oculta apenas carga la página
    crearModalExito();

    const modalExito = document.getElementById('modal-exito');
    const btnVolverInicio = document.getElementById('btn-volver-inicio');

    // 3. Cuando le da clic al botón Reservar (el que ya tenías)
    btnReservar.addEventListener('click', () => {
        // Aparece la ventana modal
        modalExito.classList.add('activo');
    });

    // 4. Cuando le da clic a "Volver al Inicio" en la modal
    btnVolverInicio.addEventListener('click', () => {
        // Limpiamos la mesa de trabajo por seguridad
        sessionStorage.removeItem('pasajerosVuelo');
        sessionStorage.removeItem('estadoVueloActual');
        
        // Lo devolvemos al Home usando REPLACE (para que la flecha de atrás quede bloqueada)
        window.location.replace('home.html');
    });
});

