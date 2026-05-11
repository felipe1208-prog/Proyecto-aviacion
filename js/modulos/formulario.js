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