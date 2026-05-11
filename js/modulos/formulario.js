document.addEventListener("DOMContentLoaded", () => {
    if(typeof aplicarFondo === 'function') aplicarFondo();

    //Mostrar u ocultar Fecha de Regreso ---
    const radiosTipoViaje = document.querySelectorAll('input[name="tipoViaje"]');
    const grupoFechaRegreso = document.getElementById('grupoFechaRegreso');
    const inputFechaRegreso = document.getElementById('fechaRegreso'); // Para limpiarlo si lo ocultan

    radiosTipoViaje.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'ida y vuelta') {
                grupoFechaRegreso.classList.remove('oculto');
                // Hacemos que la fecha de regreso sea obligatoria
                inputFechaRegreso.required = true; 
            } else {
                grupoFechaRegreso.classList.add('oculto');
                // Le quitamos lo obligatorio y borramos si había algo escrito
                inputFechaRegreso.required = false; 
                inputFechaRegreso.value = ""; 
            }
        });
    });
    // --------------------------------------------------------
});


// 1. FUNCIÓN PARA PASAR AL PASO 2 (Generar Pasajeros)
function avanzarAPasajeros() {
    const origen = document.getElementById('origen');
    const destino = document.getElementById('destino');
    const fechaIda = document.getElementById('fechaIda');
    const fechaRegreso = document.getElementById('fechaRegreso');
    const tipoViaje = document.querySelector('input[name="tipoViaje"]:checked').value;

    // Verificamos que los campos de texto no esten vacios 
    if (origen.value.trim() === "") {
        alert("Por favor, ingresa la ciudad de Origen.");
        origen.focus(); // Pone el cursor parpadeando en ese campo
        return;
    }
    
    if (destino.value.trim() === "") {
        alert("Por favor, ingresa la ciudad de Destino.");
        destino.focus();
        return;
    }
    
    if (fechaIda.value === "") {
        alert("Por favor, selecciona la Fecha de Ida.");
        fechaIda.focus();
        return;
    }
    
    if (tipoViaje === 'ida y vuelta' && fechaRegreso.value === "") {
        alert("Por favor, selecciona la Fecha de Regreso.");
        fechaRegreso.focus();
        return;
    }
    // Obtenemos las cantidades
    const adultos = parseInt(document.getElementById('cantAdultos').value);
    const menores = parseInt(document.getElementById('cantMenores').value);
    const mayores = parseInt(document.getElementById('cantMayores').value);
    const contenedor = document.getElementById('contenedor-formularios-dinamicos');
    
    // Limpiamos el contenedor
    contenedor.innerHTML = '';

    // Generar Adultos
    for (let i = 1; i <= adultos; i++) {
        generarPasajero('molde-adulto', i, contenedor, i === 1); 
    }

    // Generar Menores
    for (let i = 1; i <= menores; i++) {
        generarPasajero('molde-menor', adultos + i, contenedor, false);
    }
    
    // Generar Personas mayores
    for (let i = 1; i <= mayores; i++){
        // Corrección: sumar adultos + menores para mantener el orden correcto
        generarPasajero('molde-mayor', adultos + menores + i, contenedor, false);
    }

    document.getElementById('paso-1-vuelo').classList.add('oculto');
    document.getElementById('paso-2-pasajeros').classList.remove('oculto');
    
    window.scrollTo(0, 0);
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

    // Lógica para la pregunta de embarazo
    const selectGenero = clon.querySelector('.input-genero');
    const divEmbarazo = clon.querySelector('.contenedor-embarazo');
    const radiosEmbarazo = clon.querySelectorAll('.contenedor-embarazo input[type="radio"]');
    radiosEmbarazo.forEach(radio => radio.name = `embarazo_pasajero_${numero}`);

    if (selectGenero && divEmbarazo) {
        selectGenero.addEventListener('change', function() {
            if (this.value === 'femenino') {
                divEmbarazo.classList.remove('oculto'); // Fuerza a que aparezca
            } else {
                divEmbarazo.classList.add('oculto'); // Fuerza a que se oculte
            }
        });
    }

    // Lógica para calcular edad 
    const inputFecha = clon.querySelector('.input-fecha-nac');
    const inputEdad = clon.querySelector('.input-edad');

    // Evita que el código se rompa si olvidaste poner el campo de edad en el HTML
    if (inputFecha && inputEdad) {
        inputFecha.addEventListener('change', function() {
            if(this.value) {
                const edadCalculada = calcularEdad(this.value);
                
                // --- NUEVA LÓGICA DE VALIDACIÓN ---
                let esValido = true;
                let mensajeError = "";

                if (idMolde === 'molde-adulto') {
                    // Adulto: entre 13 y 64 años
                    if (edadCalculada < 13 || edadCalculada >= 65) {
                        esValido = false;
                        mensajeError = "Un adulto debe tener entre 13 y 64 años.";
                    }
                } else if (idMolde === 'molde-menor') {
                    // Menor: 12 años o menos
                    if (edadCalculada > 12) {
                        esValido = false;
                        mensajeError = "Un menor debe tener 12 años o menos.";
                    }
                } else if (idMolde === 'molde-mayor') {
                    // Tercera edad: 65 años o más
                    if (edadCalculada < 65) {
                        esValido = false;
                        mensajeError = "Un pasajero de tercera edad debe tener 65 años o más.";
                    }
                }

                // Si la edad es correcta, la mostramos. Si no, borramos el campo y lanzamos alerta.
                if (esValido) {
                    inputEdad.value = edadCalculada + " años";
                } else {
                    alert(mensajeError); // Muestra un cuadro de aviso al usuario
                    this.value = "";     // Borra la fecha del calendario
                    inputEdad.value = ""; // Deja la casilla de edad vacía
                }
                
            } else {
                inputEdad.value = "";
            }
        });
    }

    contenedor.appendChild(clon);
}

// 3. FUNCIÓN PARA REGRESAR AL PASO 1
function volverAPaso1() {
    document.getElementById('paso-2-pasajeros').classList.add('oculto');
    document.getElementById('paso-1-vuelo').classList.remove('oculto');
}

// Función para sumar o restar en los contadores
function modificarContador(idInput, cambio) {
    const input = document.getElementById(idInput);
    let valorActual = parseInt(input.value);
    
    // Calculamos el nuevo valor
    let nuevoValor = valorActual + cambio;
    
    // Evitamos que baje del mínimo permitido
    if (nuevoValor >= parseInt(input.min)) {
        input.value = nuevoValor;
    }
}

// inyectar los datos de la cartelera de home.html
document.addEventListener('DOMContentLoaded', () => {
    const query = new URLSearchParams(window.location.search);
    const ruta = query.get('ruta');
    const fecha = query.get('fecha');

    const campoOrgien = document.getElementById('origen');
    const campoDestino = document.getElementById('destino');
    const campoFecha = document.getElementById('fechaIda');

    // funcion para formatear la fechas a dd/mm/yyyy
    function formatearFecha(fechaTexto) {
        // diccionario para matchear fechas
        const meses = {
            'ene': '01', 'enero': '01',
            'feb': '02', 'febrero': '02',
            'mar': '03', 'marzo': '03',
            'abr': '04', 'abril': '04',
            'may': '05', 'mayo': '05',
            'jun': '06', 'junio': '06',
            'jul': '07', 'julio': '07',
            'ago': '08', 'agosto': '08',
            'sep': '09', 'septiembre': '09',
            'oct': '10', 'octubre': '10',
            'nov': '11', 'noviembre': '11',
            'dic': '12', 'diciembre': '12'
        };

        // se quita la hora desde la coma
        const soloFecha = fechaTexto.split(',')[0].trim();
        // se separa la fecha en 3 partes
        const partes = soloFecha.toLowerCase().split(' ');

        if (partes.length === 3) {
            let dia = partes[0].padStart(2, '0'); // dia con 2 digitos siempre
            let mes = meses[partes[1]] || '01';
            let anio = partes[2];

            return `${anio}-${mes}-${dia}`;
        }

        return fechaTexto; // return en caso de error
    }

    if (ruta && fecha && campoOrgien && campoDestino && campoFecha) {
        const partesRuta = ruta.split('-');
        const origenSeparado = partesRuta[0].trim();
        const destinoSeparado = partesRuta[1].trim();

        // se llenan los inputs
        campoOrgien.value = origenSeparado;
        campoDestino.value = destinoSeparado;
        campoFecha.value = formatearFecha(fecha);

        // bloquear los inputs
        campoDestino.readOnly = true;
        campoOrgien.readOnly = true;
        campoFecha.readOnly = true;
    }
});

// funcion para calcular la edad 
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento + 'T00:00:00');
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const diferenciaMeses = hoy.getMonth() - fechaNac.getMonth();

    // Corrección: Sin el punto y coma traicionero al final del if
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    
    return edad;
}


