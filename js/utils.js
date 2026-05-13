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
                    <p>1. Aceptación de los Términos y Uso del Sitio Web
Al hacer uso de este sitio web para consultar disponibilidad o realizar reservas (simuladas), el usuario acepta sin restricción ni condición los términos y notificaciones aquí establecidos. La aerolínea se reserva el derecho de modificar este acuerdo o cancelar reservas especulativas, falsas o múltiples sin previo aviso. El usuario reconoce los derechos de autor absolutos de la aerolínea sobre el contenido y marcas de esta plataforma.</p>
                    <p>2. Políticas de Equipaje y Artículos Prohibidos
Equipaje de Mano: Cada pasajero tiene derecho exclusivo a una (1) pieza de equipaje de mano con un peso máximo de 10 kg.

Artículos Prohibidos: Queda terminantemente prohibida la importación, transporte en cabina o facturación de alcohol y cualquier producto derivado del cerdo, independientemente de si fueron adquiridos en tiendas libres de impuestos (duty free).

Declaración de Valor: Para el equipaje facturado, la aerolínea responderá en caso de pérdida o daño únicamente hasta el límite del valor estándar. Cualquier declaración expresa de valor especial requerirá documentación comprobatoria y no podrá superar los límites vigentes establecidos por la aerolínea, cesando la responsabilidad en el momento de la entrega en el destino final.</p>
                    <p>3. Condiciones Médicas, Discapacidades y Asignación de Asientos
Para garantizar la seguridad de todos los pasajeros a bordo, se establecen las siguientes normativas de transporte y asignación de asientos:

Pasajeros con Discapacidad o Movilidad Reducida: Se considerará dentro de esta categoría a cualquier persona con discapacidades físicas, motoras, condiciones médicas especiales o movilidad reducida transitoria o permanente.

Restricciones de Asientos: Por estrictas normativas de seguridad aeronáutica, las mujeres embarazadas, niños, personas de la tercera edad, y pasajeros con cualquier tipo de discapacidad, padecimiento o movilidad reducida no podrán ocupar asientos ubicados en las salidas de emergencia ni aquellos adyacentes al pasillo central. Esto con el fin de evitar la obstrucción de las vías de evacuación en caso de contingencia.

Mujeres Embarazadas: Toda pasajera con 20 semanas o más de gestación deberá presentar obligatoriamente un justificativo médico actualizado que autorice el viaje. De no presentarlo al momento del embarque, la reserva será rechazada de forma inmediata sin derecho a reclamo.</p>
                    <p>4. Restricciones de Edad y Menores no Acompañados
Menores de Edad: No se permite bajo ninguna excepción que infantes o niños en un rango de edad de 0 a 12 años viajen solos. Todo pasajero en este rango de edad debe estar acompañado ineludiblemente por un adulto responsable en la misma reserva.</p>
                    <p>5. Transporte de Animales (Política de Cero Tolerancia)
Prohibición Total: Esta aerolínea no ofrece servicios de transporte de animales, ni en cabina ni en bodega. Esta regla se aplica sin excepción alguna.

Animales de Asistencia: Las mascotas de apoyo emocional o animales de servicio/guía están igualmente prohibidos. Cualquier usuario que requiera viajar con un animal de asistencia y proceda a realizar una reserva, lo hará bajo su propio y absoluto riesgo, asumiendo que se le denegará el embarque al momento de presentarse en el aeropuerto.</p>
                    <p>6. Retrasos, Cancelaciones y Situaciones de Emergencia:
Cancelaciones Voluntarias: Se otorgará un reembolso completo (aplicable al entorno de simulación) únicamente si el pasajero cancela su itinerario dentro de las 24 horas siguientes a la emisión de la reserva.

Retrasos Operativos: En caso de que el vuelo sufra un retraso mayor a dos (2) horas, la aerolínea ofrecerá asistencia básica (alimentación y comunicación). Si el retraso supera las cinco (5) horas, el pasajero tendrá derecho a solicitar el reembolso de su billete.

Emergencias de Fuerza Mayor: Frente a situaciones de emergencia imprevistas de índole natural, climatológica, sociopolítica o de orden público que impidan la salida del vuelo, la aerolínea no realizará reembolsos. En su lugar, se reasignarán automáticamente los asientos a los pasajeros en un vuelo de contingencia que tendrá lugar en un plazo no mayor a un (1) mes desde la fecha original.</p>
                    <p>7. Documentación Requerida: Es responsabilidad única y exclusiva del pasajero cumplir con los requisitos migratorios. Todo usuario deberá portar un pasaporte vigente con al menos tres (3) meses de validez antes de su expiración, así como los visados y reservas de hotel impresas correspondientes que exija el país de destino. La omisión de estos documentos resultará en la denegación del embarque.</p>
                    <p>8. Exención de Responsabilidad y Enlaces a Terceros: Este sitio web puede contener información o enlaces a servicios de terceros (como seguros, hoteles o alquiler de autos). La aerolínea no se hace responsable por las políticas, operaciones o posibles perjuicios derivados del uso de plataformas externas. El usuario asume total responsabilidad al interactuar con proveedores ajenos a la aerolínea.</p>
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
                <div class="modal-contenido" style="width: 600px; position: relative; padding-top: 40px;">
                    
                    <button id="btn-cerrar-x" style="position: absolute; top: 15px; right: 20px; font-size: 28px; background: none; border: none; cursor: pointer; color: #aaa; transition: color 0.2s;" onmouseover="this.style.color='#e74c3c'" onmouseout="this.style.color='#aaa'">&times;</button>
                    
                    <h2 class="modal-titulo" style="text-align: center; margin-bottom: 25px; font-family: var(--fuente-principal);, color: var(--azul);">Mis Reservaciones</h2>
                    
                    <div id="contenedor-historial-vuelos" style="max-height: 65vh; overflow-y: auto; padding-right: 20px; padding-left: 5px; padding-bottom: 20px; overflow-x: hidden; box-sizing: border-box;">
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
                    <h3 class="modal-titulo" style="color: var(--azul); font-family: var(--fuente-principal); margin-bottom: 10px;">¿Eliminar Boleto?</h3>
                    <p style="margin: 15px 0; margin-bottom: 20px; font-family: var(--fuente-principal); line-height: 1.2;">¿Estás seguro de que deseas eliminar este boleto? Esta acción no se puede deshacer.</p>
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
        contenedor.innerHTML = '<p style="text-align: center; color: #777; margin-top: 20px; font-family: var(--fuente-principal);">No tienes reservaciones activas en esta sesión.</p>';
        return;
    }

    contenedor.innerHTML = ''; // Limpiamos la mesa antes de dibujar

    // REGLA 2.1: Segmentado por vuelo
    historial.forEach((vuelo, vIndex) => {
        
        // CORRECCIÓN 1: El calc() en el width de la línea de segmentación
        const lineaSegmentacion = `
            <div style="display: flex; align-items: center; margin: 35px 0 20px 0; width: 97%;">
                
                <span style="font-weight: bold; color: #0a1f44; font-size: 16px; flex-shrink: 1; padding-right: 10px; font-family: var(--fuente-principal);">
                    ${vuelo.origen || 'Origen'} - ${vuelo.destino || 'Destino'}, ${vuelo.fechaViaje || 'Fecha'}
                </span>
                
                <div style="flex-grow: 1; height: 1px; border-top: 2px dashed #ccc; min-width: 30px;"></div>
                
                <span style="font-weight: bold; white-space: nowrap; color: #0a1f44; flex-shrink: 0; padding-left: 16px; font-family: var(--fuente-principal);">
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
        // CORRECCIÓN 1B: El calc() en el width del grid
        gridBoletos.style.width = '97%';

        vuelo.pasajeros.forEach((pasajero, pIndex) => {
            const partesNombre = pasajero.nombreCompleto.split(' ');
            const nombre = partesNombre[0] || '';
            const apellido = partesNombre.slice(1).join(' ') || '';
            const letraClase = pasajero.codigoBoleto ? pasajero.codigoBoleto.slice(-1).toUpperCase() : '';

            // CORRECCIÓN 2 y 3: height 100% en el div principal y padding/overflow en el div del QR
            const ticketHTML = `
                <div style="border: 2px solid #2C3B4D; border-radius: 12px; padding: 20px 20px 35px 20px; position: relative; display: flex; justify-content: space-between; background: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.04); height: 100%; box-sizing: border-box;">
                    
                    <div style="font-size: 14px; line-height: 1.5;">
                        <div><strong style="color:#aaa; font-size: 10px; letter-spacing: 1px; font-family: var(--fuente-principal);">NOMBRE</strong><br><span style="font-weight:bold; color:#333; font-size: 12px; font-family: var(--fuente-principal);">${nombre}</span></div>
                        <div style="margin-top: 8px;"><strong style="color:#aaa; font-size: 10px; letter-spacing: 1px; font-family: var(--fuente-principal);">APELLIDO</strong><br><span style="font-weight:bold; color:#333; font-size: 12px; font-family: var(--fuente-principal);">${apellido}</span></div>
                        <div style="margin-top: 8px;"><strong style="color:#aaa; font-size: 10px; letter-spacing: 1px; font-family: var(--fuente-principal);">DOCUMENTO</strong><br><span style="font-weight:bold; color:#555; font-family: var(--fuente-principal); font-size: 12px;">${pasajero.documentoId}</span></div>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between;">
                        <div class="espacio-qr" style="width: 75px; height: 75px; background: #f9f9f9; border: 2px dashed #ccc; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 4px;">
                            <img src="assets/icons/qr-os-airlines.png" style="width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply;">
                        </div>
                        <div style="font-size: 26px; font-weight: 900; color: #f2a65a; margin-top: 15px; line-height: 1; font-family: var(--fuente-principal); ">
                            ${pasajero.id} - ${letraClase}
                        </div>
                    </div>

                    <button onclick="abrirConfirmacionEliminar(${vIndex}, ${pIndex})" style="position: absolute; bottom: 8px; left: 8px; background: none; border: none; font-size: 12px; cursor: pointer; color: #bbb; transition: color 0.2s;" onmouseover="this.style.color='#e74c3c'" onmouseout="this.style.color='#bbb'" title="Eliminar boleto">
                        Eliminar
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