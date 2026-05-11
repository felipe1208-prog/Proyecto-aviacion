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


// ==========================================
// 1. LA FÁBRICA: Función que inyecta la modal
// ==========================================
function crearModalPoliticas() {
    // Si la modal ya existe (por si acaso), no la volvemos a crear
    if (document.getElementById('modal-politicas')) return;

    const modalHTML = `
        <div id="modal-politicas" class="modal-overlay">
            <div class="modal-contenido">
                <h3 class="modal-titulo">Términos y Condiciones</h3>
                <div class="modal-texto">
                    <p><strong>1. Equipaje:</strong> Todo pasajero tiene derecho a un equipaje de mano de hasta 10kg y un artículo personal.</p>
                    <p><strong>2. Cancelaciones:</strong> Las cancelaciones deben hacerse con 48 horas de anticipación para optar a reembolso.</p>
                    <p><strong>3. Asignación de Asientos:</strong> Si no confirmas tu asiento, el sistema te asignará uno aleatorio al momento del check-in.</p>
                    <p><strong>4. Reembolsos:</strong> Los boletos en tarifa "Club Economy" incluyen reembolso completo. La "Clase Turista" tiene penalidad.</p>
                </div>
                <button id="btn-entendido" class="btn-confirmar">Entendido</button>
            </div>
        </div>
    `;
    
    // Inyecta todo este código justo antes de cerrar el </body>
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ==========================================
// 2. EL MOTOR: Encendemos la lógica al cargar la página
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // PASO A: ¡Construimos la modal primero!
    crearModalPoliticas();

    // PASO B: Ahora que ya existe en el HTML, buscamos sus piezas
    const modal = document.getElementById('modal-politicas');
    const btnEntendido = document.getElementById('btn-entendido');
    const linkPoliticas = document.getElementById('link-politicas');

    // PASO C: Configuramos el clic en el menú "POLITICAS"
    if (linkPoliticas) {
        linkPoliticas.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que la página salte
            modal.classList.add('activo'); // Muestra la ventana
        });
    }

    // PASO D: Configuramos el botón de "Entendido" para cerrar
    if (btnEntendido) {
        btnEntendido.addEventListener('click', () => {
            modal.classList.remove('activo'); // Oculta la ventana
        });
    }

    // PASO E: Si el usuario hace clic en lo negro, también se cierra
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('activo');
        }
    });
    
    // ... aquí puedes dejar tu otra función de aplicarFondo() que ya tenías ...
});
>>>>>>> a17b69ca92a0ac0ed31b8a3d84c48fe143626e58
