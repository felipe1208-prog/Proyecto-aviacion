const imagenesFondo = [
    "assets/img/aeropuerto.jpg",
    "assets/img/avion1.jpg",
    // "assets/img/fondo.jpg"
];

// Aplica un fondo estático al cargar la página
function aplicarFondo() {
    const indiceFondo = Math.floor(Math.random() * imagenesFondo.length);
    const body = document.body;
    
    // Le inyectamos el fondo directamente al body
    body.style.backgroundImage = `
        linear-gradient(
            rgba(201, 193, 177, 0.85), 
            rgba(201, 193, 177, 0.85)
        ), 
        url('${imagenesFondo[indiceFondo]}')
    `;
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