document.addEventListener("DOMContentLoaded", () => {
    aplicarFondo();
});

document.addEventListener('DOMContentLoaded', () => {

    const contenedorFilas = document.querySelector('.contenedor-filas');
    const asientos = document.querySelector('.asiento');
    const btnReservar = document.querySelector('.btn-reservar');

    let pasajeroActivo = null;


    //datos del local storage
    function cargarPasajerosLocalStorage() {
        const datosMochila = localStorage.getItem('pasajerosVuelo');

        if (datosMochila) {
            const pasajeros = JSON.parse(datosMochila);
            contenedorFilas.innerHTML = ''; //por si acaso

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

    //ocupacion aleatoria de asientos en base al estado de la cartelera en home
    function generarAsientosOcupados(porcentaje) {
        if (porcentaje <= 0) return [];
        const todosLosAsientosDOM = document.querySelectorAll('.asiento');
        const todosLosIDs = Array.from(todosLosAsientosDOM).map(a => a.dataset.asiento);
        const cantidadAOcupar = Math.floor(todosLosIDs.length * (porcentaje/100));
        const asientosMezclados = todosLosIDs.sort(() => 0.5 - Math.random());
        return asientosMezclados.slice(0, cantidadAOcupar);
    }

    function asientosBloqueados(listaAsientosOcupados) {
        listaAsientosOcupados.forEach(numeroAsiento => {
            const asientoDOM = document.querySelector(`.asiento[.data-asiento="${numeroAsiento}"]`);
            if (asientoDOM) asientoDOM.classList.add('ocupado');
        });
    }

    //ejecutar al cargar la pagina
    cargarPasajerosLocalStorage();

    const infoVuelo = localStorage.getItem('estadoVueloActual');
    let porcentajeOcupacion = 0;

    if (infoVuelo === "En Reserva") porcentajeOcupacion = 15;
    if (infoVuelo === "Próximo a Abordar") porcentajeOcupacion = 50;

    const asientosYaComprados = generarAsientosOcupados(porcentajeOcupacion);
    bloquearAsientos(asientosYaComprados);

    const filaBoletos = document.querySelectorAll('.fila-tabla');

        //seleccionamos pasajero
    filasBoletos.forEach(fila => {
        fila.addEventListener('click', () => {
            seleccionarPasajero(fila);
        });
    });

    function seleccionarPasajero(filaDOM) {
        // Quitamos la selección a todos y se la ponemos solo al clickeado
        filasBoletos.forEach(f => f.classList.remove('boleto-activo'));
        filaDOM.classList.add('boleto-activo');
        pasajeroActivo = filaDOM; 
    }

    asientos.forEach(asiento => {
        asiento.addEventListener('click', () => {
            // Si el asiento está ocupado por alguien más en el vuelo, lo bloqueamos
            if (asiento.classList.contains('ocupado')) return;

            // Validamos que haya seleccionado a un pasajero en la tabla
            if (!pasajeroActivo) return; 

            // Usamos tu excelente atributo data-asiento (ej: "1A")
            const numeroAsiento = asiento.dataset.asiento;

            // Evitamos que dos personas de tu mismo grupo elijan el MISMO asiento
            if(asiento.classList.contains('seleccionado')) return;

            // Buscamos el 'badge' del asiento dentro de la fila del pasajero seleccionado
            const badgeAsiento = pasajeroActivo.querySelector('.badge-asiento');
            const asientoViejo = badgeAsiento.textContent.trim();

            // Si el pasajero ya tenía un asiento y se arrepintió, liberamos el viejo en el avión
            if (asientoViejo !== "--" && asientoViejo !== "") {
                const asientoDOMViejo = document.querySelector(`.asiento[data-asiento="${asientoViejo}"]`);
                if (asientoDOMViejo) {
                    asientoDOMViejo.classList.remove('seleccionado');
                }
            }
            
            // Marcamos el nuevo asiento seleccionado en el avión
            asiento.classList.add('seleccionado');

            // Actualizamos la tabla visualmente (Cambiamos texto y clases del badge)
            badgeAsiento.textContent = numeroAsiento;
            badgeAsiento.classList.remove('pendiente');
            badgeAsiento.classList.add('reservado'); // Activa tu diseño de badge azul/naranja

            // Pasamos al siguiente pasajero automáticamente
            autoSeleccionarSiguiente();

            //Verificamos si activamos el botón
            validarBotonConfirmar();
        });
    });

    function autoSeleccionarSiguiente() {
        // Busca al primer pasajero que todavía tenga "--"
        const siguienteFilaLibre = Array.from(filasBoletos).find(f => {
            return f.querySelector('.badge-asiento').textContent.trim() === '--';
        });

        if (siguienteFilaLibre) {
            seleccionarPasajero(siguienteFilaLibre);
        } else {
            // Si ya terminaron, deseleccionamos la tabla para que se vea limpia
            filasBoletos.forEach(f => f.classList.remove('boleto-activo'));
            pasajeroActivo = null;
        }
    }

    function validarBotonConfirmar() {
        // Revisa si TODOS los badges dejaron de decir "--"
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

    //funcion para bloquear asientos, evolucionar a futuro
    function bloquearAsientos(listaAsientosOcupados) {
        listaAsientosOcupados.forEach(numeroAsiento => {
            const asientoDOM = document.querySelector(`.asiento[data-asiento${numeroAsiento}]`);
            if (asientoDOM) {
                asientoDOM.classList.add('ocupado');
            }
        })
    }
});