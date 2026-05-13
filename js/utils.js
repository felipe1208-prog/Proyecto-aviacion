const imagenesFondo = [
    "assets/img/aeropuerto.jpg",
    "assets/img/avion1.jpg",
    // "assets/img/fondo.jpg"
    "assets/img/avioncito.jpg",
    "assets/img/otro.jpg",
    "assets/img/chevere.jpg",
    "assets/img/mejor.jpg"
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


//Modal Boletos
function crearModalesBoletosHeader() {
    // 1. Modal Principal (Más ancho, grid de 2 columnas)
    if (!document.getElementById('modal-boletos-header')) {
        const modalPrincipal = `
            <div id="modal-boletos-header" class="modal-overlay">
                <div class="modal-contenido" style="max-width: 850px; position: relative; padding-top: 40px;">
                    
                    <button id="btn-cerrar-x" style="position: absolute; top: 15px; right: 20px; font-size: 28px; background: none; border: none; cursor: pointer; color: #aaa; transition: color 0.2s;" onmouseover="this.style.color='#e74c3c'" onmouseout="this.style.color='#aaa'">&times;</button>
                    
                    <h2 class="modal-titulo" style="text-align: center; margin-bottom: 25px;">Mis Reservaciones</h2>
                    
                    <div id="contenedor-historial-vuelos" style="max-height: 65vh; overflow-y: auto; padding-right: 15px; overflow-x: hidden;">
                        </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalPrincipal);
    }

    // 2. Modal de Confirmación (El chiquito para la papelera)
    if (!document.getElementById('modal-confirmacion-eliminar')) {
        const modalConfirmacion = `
            <div id="modal-confirmacion-eliminar" class="modal-overlay" style="z-index: 10000;">
                <div class="modal-contenido" style="max-width: 400px; text-align: center;">
                    <h3 class="modal-titulo">¿Eliminar Boleto?</h3>
                    <p style="margin: 15px 0;">¿Estás seguro de que deseas eliminar este boleto? Esta acción no se puede deshacer.</p>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button id="btn-cancelar-eliminar" class="btn-confirmar" style="background: transparent; color: #333; border: 2px solid #ccc; box-shadow: none;">No, conservar</button>
                        <button id="btn-confirmar-eliminar" class="btn-confirmar" style="background: #e74c3c;">Sí, eliminar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalConfirmacion);
    }
}

// Variables globales para saber qué estamos borrando
let boletoAEliminarVueloIndex = null;
let boletoAEliminarPasajeroIndex = null;

function renderizarBoletosHeader() {
    const contenedor = document.getElementById('contenedor-historial-vuelos');
    const historial = JSON.parse(sessionStorage.getItem('historialReservas')) || [];

    if (historial.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; color: #777; margin-top: 20px; ">No tienes reservaciones activas en esta sesión.</p>';
        return;
    }

    contenedor.innerHTML = ''; // Limpiamos la mesa antes de dibujar

    // REGLA 2.1: Segmentado por vuelo
    historial.forEach((vuelo, vIndex) => {
        
        // REGLA 5: Línea de Segmentación (Origen - Destino, Fecha ----- Maletas: n)
        const lineaSegmentacion = `
            <div style="display: flex; align-items: center; margin: 35px 0 20px 0;">
                <span style="font-weight: bold; white-space: nowrap; color: #0a1f44; font-size: 16px;">
                    ${vuelo.origen || 'Origen'} - ${vuelo.destino || 'Destino'}, ${vuelo.fechaViaje || 'Fecha'}
                </span>
                <div style="flex-grow: 1; height: 1px; border-top: 2px dashed #ccc; margin: 0 15px;"></div>
                <span style="font-weight: bold; white-space: nowrap; color: #0a1f44;">
                    Maletas: ${vuelo.maletas || '0'}
                </span>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', lineaSegmentacion);

        // REGLA 2.1: Grid de 2 columnas para los tickets
        const gridBoletos = document.createElement('div');
        gridBoletos.style.display = 'grid';
        gridBoletos.style.gridTemplateColumns = '1fr 1fr';
        gridBoletos.style.gap = '20px';

        vuelo.pasajeros.forEach((pasajero, pIndex) => {
            // Como antes guardabas "nombreCompleto", aquí lo dividimos rudimentariamente para que calce en tu diseño
            const partesNombre = pasajero.nombreCompleto.split(' ');
            const nombre = partesNombre[0] || '';
            const apellido = partesNombre.slice(1).join(' ') || '';

            // REGLA 2.3 y 4: Diseño tipo Carnet, QR a la derecha, Papelera abajo izquierda
            const ticketHTML = `
                <div style="border: 1px solid #ddd; border-radius: 12px; padding: 20px 20px 35px 20px; position: relative; display: flex; justify-content: space-between; background: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.04);">
                    
                    <div style="font-size: 14px; line-height: 1.5;">
                        <div><strong style="color:#aaa; font-size: 10px; letter-spacing: 1px;">NOMBRE</strong><br><span style="font-weight:bold; color:#333; font-size: 16px;">${nombre}</span></div>
                        <div style="margin-top: 8px;"><strong style="color:#aaa; font-size: 10px; letter-spacing: 1px;">APELLIDO</strong><br><span style="font-weight:bold; color:#333; font-size: 16px;">${apellido}</span></div>
                        <div style="margin-top: 8px;"><strong style="color:#aaa; font-size: 10px; letter-spacing: 1px;">DOCUMENTO</strong><br><span style="font-weight:bold; color:#555;">${pasajero.documentoId}</span></div>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between;">
                        <div class="espacio-qr" style="width: 75px; height: 75px; background: #f9f9f9; border: 2px dashed #ccc; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #aaa; text-align: center;">
                            Tu QR aquí
                        </div>
                        <div style="font-size: 26px; font-weight: 900; color: #f2a65a; margin-top: 15px; line-height: 1;">
                            ${pasajero.id}
                        </div>
                    </div>

                    <button onclick="abrirConfirmacionEliminar(${vIndex}, ${pIndex})" style="position: absolute; bottom: 8px; left: 8px; background: none; border: none; font-size: 18px; cursor: pointer; color: #bbb; transition: color 0.2s;" onmouseover="this.style.color='#e74c3c'" onmouseout="this.style.color='#bbb'" title="Eliminar boleto">
                        🗑️
                    </button>
                </div>
            `;
            gridBoletos.insertAdjacentHTML('beforeend', ticketHTML);
        });

        contenedor.appendChild(gridBoletos);
    });
}

// Funciones expuestas a nivel de ventana para el onclick de la papelera
window.abrirConfirmacionEliminar = function(vueloIndex, pasajeroIndex) {
    boletoAEliminarVueloIndex = vueloIndex;
    boletoAEliminarPasajeroIndex = pasajeroIndex;
    document.getElementById('modal-confirmacion-eliminar').classList.add('activo');
};

// Eventos y Controladores principales
document.addEventListener('DOMContentLoaded', () => {
    // 1. Fabricamos los modales en el HTML al cargar la página
    crearModalesBoletosHeader();

    const modalBoletos = document.getElementById('modal-boletos-header');
    const btnCerrarX = document.getElementById('btn-cerrar-x');
    const modalConfirmacion = document.getElementById('modal-confirmacion-eliminar');
    const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');

    // REGLA 3: Cerrar el modal principal SOLO con la X (No hay evento de clic afuera)
    btnCerrarX.addEventListener('click', () => {
        modalBoletos.classList.remove('activo');
    });

    // 4.1: Si se arrepiente de borrar, cerramos el modal chiquito y limpiamos variables
    btnCancelarEliminar.addEventListener('click', () => {
        modalConfirmacion.classList.remove('activo');
        boletoAEliminarVueloIndex = null;
        boletoAEliminarPasajeroIndex = null;
    });

    // 4.1: Lógica Real de Eliminación
    btnConfirmarEliminar.addEventListener('click', () => {
        let historial = JSON.parse(sessionStorage.getItem('historialReservas')) || [];
        
        // Entramos al vuelo y sacamos (splice) a ese pasajero específico
        if (historial[boletoAEliminarVueloIndex] && historial[boletoAEliminarVueloIndex].pasajeros) {
            historial[boletoAEliminarVueloIndex].pasajeros.splice(boletoAEliminarPasajeroIndex, 1);
            
            // Si después de borrarlo, el vuelo se quedó en 0 pasajeros, eliminamos el vuelo entero
            if (historial[boletoAEliminarVueloIndex].pasajeros.length === 0) {
                historial.splice(boletoAEliminarVueloIndex, 1);
            }
        }

        // Guardamos la nueva realidad en el sessionStorage y re-dibujamos la tabla
        sessionStorage.setItem('historialReservas', JSON.stringify(historial));
        renderizarBoletosHeader(); 
        
        // Cerramos el modal de confirmación
        modalConfirmacion.classList.remove('activo');
    });

    // =================================================================
    // BOTÓN DEL HEADER: Así activas el modal desde tu botón de navegación
    // =================================================================
    const btnMisBoletosHeader = document.getElementById('link-mis-boletos'); // Cambia este ID por el ID real del enlace en tu Header
    if (btnMisBoletosHeader) {
        btnMisBoletosHeader.addEventListener('click', (e) => {
            e.preventDefault();
            renderizarBoletosHeader(); // Siempre pintamos antes de abrir para que lea lo más nuevo
            modalBoletos.classList.add('activo');
        });
    }
});