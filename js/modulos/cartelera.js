// 1. Empuja el estado actual al historial
window.history.pushState(null, "", window.location.href);

// 2. Si el usuario intenta darle a la flecha de atrás...
window.onpopstate = function () {
    // Lo volvemos a empujar hacia adelante de inmediato
    window.history.pushState(null, "", window.location.href);
};


const imagenesPublicidad = [
    "assets/img/camino-lindo.jpg",
    "assets/img/egipto.jpg",
    "assets/img/italia.jpg",
    "assets/img/machupichu.jpg",
    // "assets/img/montana.jpg",
    "assets/img/playa.jpg",
    "assets/img/IMG-20260510-WA0062.jpg",
    "assets/img/IMG-20260510-WA0066.jpg",
    "assets/img/IMG-20260510-WA0067.jpg",
    "assets/img/IMG-20260510-WA0069.jpg",
    "assets/img/IMG-20260510-WA0070.jpg",
    "assets/img/IMG-20260510-WA0072.jpg"
];

let indicePublicidadActual = Math.floor(Math.random() * imagenesPublicidad.length);


//ciclo de cambio de foto publicidad
function iniciarCicloPublicidad() {
    const imgPublicidad = document.querySelector('.contenedor-imagen img');
    if (!imgPublicidad) return;

    // Seteamos la primera imagen inmediatamente
    imgPublicidad.src = imagenesPublicidad[indicePublicidadActual];

    // Función interna que hace el cambio desvanecido inteligente
    function siguienteImagen() {
        // Paso A: Iniciamos el desvanecimiento de la imagen vieja
        imgPublicidad.classList.add('fade-out');

        // Paso B: Esperamos a que la imagen vieja sea completamente invisible (0.5s)
        setTimeout(() => {
            // Incrementamos el índice
            indicePublicidadActual = (indicePublicidadActual + 1) % imagenesPublicidad.length;
            
            // --- Técnica de Precarga ---
            const imagenPrevia = new Image();
            imagenPrevia.src = imagenesPublicidad[indicePublicidadActual];

            // --- Esperamos a que la nueva imagen cargue ---
            imagenPrevia.onload = () => {
                imgPublicidad.src = imagenPrevia.src;
                imgPublicidad.classList.remove('fade-out');
                imgPublicidad.classList.add('fade-in');

                setTimeout(() => {
                    imgPublicidad.classList.remove('fade-in');
                }, 500); 
            };

        }, 500); 
    }

    setInterval(siguienteImagen, 8000);
}


const aeropuertos = [
    "Caracas (CCS)",         
    "Valencia (VLN)",       
    "Bogotá (BOG)",          
    "Medellín (MDE)",        
    "Panamá (PTY)",          
    "Lima (LIM)",            
    "Santiago (SCL)",        
    "Buenos Aires (EZE)",    
    "São Paulo (GRU)",       
    "Río de Janeiro (GIG)",  
    "Ciudad de México (MEX)",
    "Cancún (CUN)",          
    "Miami (MIA)",           
    "Santo Domingo (SDQ)",   
    "Punta Cana (PUJ)",      
    "San José (SJO)",        
    "San Salvador (SAL)",    
    "Quito (UIO)"            
];

function generarRuta(aeropuertos) {
    let indiceOrigen = Math.floor(Math.random() * aeropuertos.length);
    let origen = aeropuertos[indiceOrigen];

    let indiceDestino = Math.floor(Math.random() * aeropuertos.length);
    let destino = aeropuertos[indiceDestino];

    while (origen === destino) {
        indiceDestino = Math.floor(Math.random() * aeropuertos.length);
        destino = aeropuertos[indiceDestino];
    }

    return `${origen} - ${destino}`;
};



function generarFechaYEstado() {
    const ahora = new Date();

    const fechaBase = new Date(ahora);
    const minutosActuales = fechaBase.getMinutes();
    const resto = minutosActuales % 5;
    
    if (resto !== 0) {
        fechaBase.setMinutes(minutosActuales + (5 - resto));
    }
    fechaBase.setSeconds(0); 

    const intervalo = Math.floor(Math.random() * 144);
    const minutosEnElFuturo = intervalo * 5;

    const fechaVuelo = new Date(fechaBase.getTime() + (minutosEnElFuturo * 60000));

    const diferenciaMilisegundos = fechaVuelo.getTime() - ahora.getTime();
    const minutosRestantesReales = Math.floor(diferenciaMilisegundos / 60000);

    let estadoVuelo = "";
    let claseBadge = "";

    if (minutosRestantesReales <= 15) {
        estadoVuelo = "En Abordaje";
        claseBadge = "badge-rojo";
    } else if (minutosRestantesReales <= 60) {
        estadoVuelo = "Próximo a Abordar";
        claseBadge = "badge-amarillo";
    } else {
        estadoVuelo = "En Reserva";
        claseBadge = "badge-verde";
    }

    // Formateo de fecha a texto
    const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
    const fechaFormateada = fechaVuelo.toLocaleDateString('es-ES', opciones);

    // Obtenemos la hora en formato 24h y aseguramos que tenga 2 dígitos (ej. 09 o 14)
    const horasStr = fechaVuelo.getHours().toString().padStart(2, '0');
    
    // Minutos asegurando que tengan 2 dígitos
    const minutosStr = fechaVuelo.getMinutes().toString().padStart(2, '0');

    // Armamos el texto final en formato 24h (sin AM/PM)
    const textoFecha = `${fechaFormateada}, ${horasStr}:${minutosStr}`;

    return {
        fecha: textoFecha,
        estado: estadoVuelo,
        claseBadge: claseBadge 
    };
}


function generadorCodigoVuelo() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const prefijo = letras.charAt(Math.floor(Math.random() * letras.length)) + letras.charAt(Math.floor(Math.random() * letras.length));
    const numero = Math.floor(Math.random() * 9000) + 1000;

    return `${prefijo}-${numero}`;
};

function datosParaFormulario(codigo, ruta, fecha, estado) {
    
    sessionStorage.setItem('estadoVueloActual', estado);
    
    if (estado === 'En Abordaje') {
        window.location.replace('abordaje.html');
    } else {
        const url = `formulario.html?vuelo=${codigo}&ruta=${encodeURIComponent(ruta)}&fecha=${encodeURIComponent(fecha)}`;
        window.location.replace(url);
    }
}

//FUNCION PRINCIPAL DE GENERACION DE TABLA
function cargarVuelos() {
    const contenedor = document.querySelector('.cuadro-vuelos');
    
    let htmlCartelera = `
    <div class= "cabecera-tabla">
    <div class="columna">Vuelo</div>
    <div class="columna">Ruta</div>
    <div class="columna">Salida</div>
    <div class="columna">Estado</div>
    </div>
    `;
    
    const cantidadVuelos = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < cantidadVuelos; i++) {
        const codigo = generadorCodigoVuelo();
        const ruta = generarRuta(aeropuertos);
        const datosVuelo = generarFechaYEstado();
        
        htmlCartelera += `
            <div class="fila-cuadro" onclick="datosParaFormulario('${codigo}', '${ruta}', '${datosVuelo.fecha}', '${datosVuelo.estado}')">
                <div class="vuelo-nro">${codigo}</div>
                <div class="vuelo-ruta">${ruta}</div>
                <div>${datosVuelo.fecha}</div>
                <div>
                    <span class="badge ${datosVuelo.claseBadge}">${datosVuelo.estado}</span>
                </div>
            </div>
        `;
    }
    
    contenedor.innerHTML = htmlCartelera;
};

document.addEventListener('DOMContentLoaded', () => {
    // Si la función aplicarFondo existe en utils.js, la llamamos
    if(typeof aplicarFondo === 'function') aplicarFondo();
    iniciarCicloPublicidad();
    cargarVuelos();
});


function generadorCodigoVuelo() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //2 Letras al azar
    const prefijo = letras.charAt(Math.floor(Math.random() * letras.length)) + letras.charAt(Math.floor(Math.random() * letras.length));

    //nro entre 1000 y 9999
    const numero = Math.floor(Math.random() * 9000) + 1000;

    return `${prefijo}-${numero}`;
};

function datosParaFormulario(codigo, ruta, fecha, estado) {
    
    sessionStorage.setItem('estadoVueloActual', estado);
    
    if (estado === 'En Abordaje') {
        window.location.replace('abordaje.html');
    } else {
        const url = `formulario.html?vuelo=${codigo}&ruta=${encodeURIComponent(ruta)}&fecha=${encodeURIComponent(fecha)}`;
        window.location.replace(url);
    }
}

//FUNCION PRINCIPAL DE GENERACION DE TABLA
function cargarVuelos() {
    const contenedor = document.querySelector('.cuadro-vuelos');

    
    //varaible de la cartelera
    let htmlCartelera = `
    <div class= "cabecera-tabla">
    <div class="columna">Vuelo</div>
    <div class="columna">Ruta</div>
    <div class="columna">Salida</div>
    <div class="columna">Estado</div>
    </div>
    `;
    
    //cantidad de vuelos en cartelera
    const cantidadVuelos = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < cantidadVuelos; i++) {
        const codigo = generadorCodigoVuelo();
        const ruta = generarRuta(aeropuertos);
        //funcion grande 
        const datosVuelo = generarFechaYEstado();
        
        //fila inyectada a la cartelera
        htmlCartelera += `
            <div class="fila-cuadro" onclick="datosParaFormulario('${codigo}', '${ruta}', '${datosVuelo.fecha}', '${datosVuelo.estado}')">
                <div class="vuelo-nro">${codigo}</div>
                <div class="vuelo-ruta">${ruta}</div>
                <div>${datosVuelo.fecha}</div>
                <div>
                    <span class="badge ${datosVuelo.claseBadge}">${datosVuelo.estado}</span>
                </div>
            </div>
        `;
        
    }
    
    contenedor.innerHTML = htmlCartelera;
};


document.addEventListener('DOMContentLoaded', () => {
    aplicarFondo(imagenesFondo);
    iniciarCicloPublicidad();
    cargarVuelos();
});
