document.addEventListener("DOMContentLoaded", () => {
    aplicarFondo();
});

// 1. FUNCIÓN PARA PASAR AL PASO 2 (Generar Pasajeros)
function avanzarAPasajeros() {
    // Obtenemos las cantidades
    const adultos = parseInt(document.getElementById('cantAdultos').value);
    const menores = parseInt(document.getElementById('cantMenores').value);
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

    document.getElementById('paso-1-vuelo').style.display = 'none';
    document.getElementById('paso-2-pasajeros').style.display = 'block';
    
    window.scrollTo(0, 0);
}

// 2. FUNCIÓN PARA CLONAR EL MOLDE
function generarPasajero(idMolde, numero, contenedor, esPrincipal) {
    const molde = document.getElementById(idMolde);
    const clon = molde.content.cloneNode(true);

    clon.querySelector('.num-pasajero').textContent = numero;

    if (!esPrincipal) {
        const contacto = clon.querySelector('.contenedor-contacto');
        if (contacto) contacto.style.display = 'none';
    }

    // Lógica para la pregunta de embarazo
    const selectGenero = clon.querySelector('.input-genero');
    const divEmbarazo = clon.querySelector('.contenedor-embarazo');

    selectGenero.addEventListener('change', function() {
        if (this.value === 'femenino') {
            divEmbarazo.style.display = 'flex'; // Fuerza a que aparezca
        } else {
            divEmbarazo.style.display = 'none'; // Fuerza a que se oculte
        }
    });

    contenedor.appendChild(clon);
}

// 3. FUNCIÓN PARA REGRESAR AL PASO 1
function volverAPaso1() {
    document.getElementById('paso-2-pasajeros').style.display = 'none';
    document.getElementById('paso-1-vuelo').style.display = 'block';
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


//inyectar los datos de la cartelera de home.html
document.addEventListener('DOMContentLoaded', () => {
    const query = new URLSearchParams(window.location.search);
    const ruta = query.get('ruta');
    const fecha = query.get('fecha');

    const campoOrgien = document.getElementById('origen');
    const campoDestino = document.getElementById('Destino');
    const campoFecha = document.getElementById('fechaIda');

    //funcion para formatear la fechas a dd/mm/yyyy
    function formatearFecha(fechaTexto) {
        //diccionario para matchear fechas
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

        //se quita la hora desde la coma
        const soloFecha = fechaTexto.split(',')[0].trim();
        //se separa la fecha en 3 partes
        const partes = soloFecha.toLowerCase().split(' ');

        if (partes.length === 3) {
            let dia = partes[0].padStart(2, '0'); //dia con 2 digitos siempre
            let mes = meses[partes[1]] || '01';
            let anio = partes[2];

            return `${anio}-${mes}-${dia}`;
        }

        return fechaTexto; //return en caso de error
    }


    if (ruta && fecha) {

        const partesRuta = ruta.split('-')
        const origenSeparado = partesRuta[0].trim();
        const destinoSeparado = partesRuta[1].trim();

        //se llenan los inputs
        campoOrgien.value = origenSeparado;
        campoDestino.value = destinoSeparado;
        campoFecha.value = formatearFecha(fecha);

        //bloquear los inputs
        campoDestino.readOnly = true;
        campoOrgien.readOnly = true;
        campoFecha.readOnly = true;
    }
})