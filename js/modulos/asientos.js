document.addEventListener("DOMContentLoaded", () => {
    aplicarFondo();
});

document.addEventListener('DOMContentLoaded', () => {

    const filasBoletos = document.querySelectorAll('.fila-tabla');
    const asientos = document.querySelectorAll('.asiento');
    const btnReservar = document.querySelector('.btn-reservar');

    let pasajeroActivo = null;

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
            if (!pasajeroActivo) {
                alert("Por favor, selecciona a un pasajero de la lista a la derecha primero.");
                return;
            }

            // Usamos tu excelente atributo data-asiento (ej: "1A")
            const numeroAsiento = asiento.dataset.asiento;

            // Evitamos que dos personas de tu mismo grupo elijan el MISMO asiento
            if(asiento.classList.contains('seleccionado')) {
                alert("Este asiento ya fue asignado a otro pasajero de tu reserva.");
                return;
            }

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
});