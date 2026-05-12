document.addEventListener("DOMContentLoaded", () => {
    if(typeof aplicarFondo === 'function') aplicarFondo();
});

document.addEventListener('DOMContentLoaded', () => {

    const contenedorFilas = document.querySelector('.contenedor-filas');
    const asientos = document.querySelectorAll('.asiento');
    const btnReservar = document.querySelector('.btn-reservar');

    let pasajeroActivo = null;

    //local storage traer
    function cargarPasajerosLocalStorage() {
        const datosMochila = localStorage.getItem('pasajerosVuelo');

        if (datosMochila) {
            const pasajeros = JSON.parse(datosMochila);
            contenedorFilas.innerHTML = ''; // Limpiamos por si acaso

            pasajeros.forEach(pasajero => {
                const filaHTML = `
                    <div class="fila-tabla">
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

    //asientos bloqueados aleatorios
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

    //ejecucion al cargar
    cargarPasajerosLocalStorage();

    const infoVuelo = localStorage.getItem('estadoVueloActual');
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

    function seleccionarPasajero(filaDOM) {
        filasBoletos.forEach(f => f.classList.remove('boleto-activo'));
        filaDOM.classList.add('boleto-activo');
        pasajeroActivo = filaDOM; 

        const idTexto = filaDOM.querySelector('.id-boleto').textContent.trim();
        const tipoTarifa = idTexto.slice(-1);
        restringirAsientosPorTarifa(tipoTarifa);
    }

    function restringirAsientosPorTarifa(tarifa) {
        const todosLosAsientos = document.querySelectorAll('.asiento');
        //se limpia cualquier restriccion anterior
        todosLosAsientos.forEach(asiento => asiento.classList.remove('restringido'));
        //nueva restriccion
        todosLosAsientos.forEach(asiento => {
            const numAsiento = asiento.dataset.asiento; //ej 1A
            const fila = parseInt(numAsiento);
            
            if (tarifa === 'E') {
                if (fila >= 3) {
                    asiento.classList.add('restringido');
                }
            } else if (tarifa === 'T') {
                if (fila <= 2) {
                    asiento.classList.add('restringido');
                }
            }
        });
    }

    // Lógica al hacer clic en un asiento del avión
    asientos.forEach(asiento => {
        asiento.addEventListener('click', () => {
            if (asiento.classList.contains('ocupado')) return;
            if (asiento.classList.contains('restringido'));
            if (!pasajeroActivo) return; 
            if(asiento.classList.contains('seleccionado')) return;

            const numeroAsiento = asiento.dataset.asiento;
            const badgeAsiento = pasajeroActivo.querySelector('.badge-asiento');
            const asientoViejo = badgeAsiento.textContent.trim();

            if (asientoViejo !== "--" && asientoViejo !== "") {
                const asientoDOMViejo = document.querySelector(`.asiento[data-asiento="${asientoViejo}"]`);
                if (asientoDOMViejo) {
                    asientoDOMViejo.classList.remove('seleccionado');
                }
            }
            
            asiento.classList.add('seleccionado');
            badgeAsiento.textContent = numeroAsiento;
            badgeAsiento.classList.remove('pendiente');
            badgeAsiento.classList.add('reservado'); 

            autoSeleccionarSiguiente();
            validarBotonConfirmar();
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
});