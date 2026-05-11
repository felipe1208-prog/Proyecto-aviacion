const imagenesPublicidad = [
    "assets/img/camino-lindo.jpg",
    "assets/img/egipto.jpg",
    "assets/img/italia.jpg",
    "assets/img/machupichu.jpg",
    // "assets/img/montana.jpg",
    "assets/img/playa.jpg",
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
            
            // --- NUEVO: Técnica de Precarga ---
            // Creamos un objeto de imagen "fantasma" en la memoria, no en el HTML
            const imagenPrevia = new Image();
            imagenPrevia.src = imagenesPublicidad[indicePublicidadActual];

            // --- NUEVO: Esperamos a que la nueva imagen cargue ---
            // Esta función SOLO se ejecuta cuando la foto nueva ya se descargó
            imagenPrevia.onload = () => {
                // 1. Ahora que sabemos que está lista, cambiamos la src de la imagen visible
                imgPublicidad.src = imagenPrevia.src;

                // 2. Iniciamos el reaparecimiento suave
                imgPublicidad.classList.remove('fade-out');
                imgPublicidad.classList.add('fade-in');

                // 3. Limpiamos la clase de fade-in para la próxima vuelta
                setTimeout(() => {
                    imgPublicidad.classList.remove('fade-in');
                }, 500); // Coincide con la transición CSS
            };

        }, 500); // Coincide con el tiempo que tarda en desaparecer
    }

    // Ejecutamos el ciclo cada 8 segundos (aumenté un poco para dar tiempo a la carga)
    setInterval(siguienteImagen, 8000);
}


const aeropuertos = [
    "Caracas (CCS)",         // Hub Venezuela
    "Valencia (VLN)",       // Conexiones directas a PTY, BOG, SDQ, MIA
    "Bogotá (BOG)",          // Hub Principal Avianca
    "Medellín (MDE)",        // Conexión directa internacional
    "Panamá (PTY)",          // "Hub de las Américas" (Conecta con todos)
    "Lima (LIM)",            // Hub Sudamérica (LATAM)
    "Santiago (SCL)",        // Nodo Sur
    "Buenos Aires (EZE)",    // Nodo Sur Internacional
    "São Paulo (GRU)",       // El más grande de Sudamérica
    "Río de Janeiro (GIG)",  // Conexión internacional
    "Ciudad de México (MEX)",// Hub Norte
    "Cancún (CUN)",          // Destino con vuelos a toda la región
    "Miami (MIA)",           // El Hub de conexión con el norte
    "Santo Domingo (SDQ)",   // Conexión Caribe
    "Punta Cana (PUJ)",      // Conexión Caribe
    "San José (SJO)",        // Hub Centroamérica
    "San Salvador (SAL)",    // Hub Avianca Centroamérica
    "Quito (UIO)"            // Conexión Andina
];

function generarRuta(aeropuertos) {
    //se elige el origen
    let indiceOrigen = Math.floor(Math.random() * aeropuertos.length);
    let origen = aeropuertos[indiceOrigen];

    //ahora el destino
    let indiceDestino = Math.floor(Math.random() * aeropuertos.length);
    let destino = aeropuertos[indiceDestino];

    //bucle para cambiar el destino si es igual al origen
    while (origen === destino) {
        indiceDestino = Math.floor(Math.random() * aeropuertos.length);
        destino = aeropuertos[indiceDestino];
    }

    return `${origen} - ${destino}`;
};



function generarFechaYEstado() {
    //Se obtiene la fecha y hora exacta
    const ahora = new Date();

    //Creamos una fecha base y forzamos a que sus minutos terminen en 0 o 5
    const fechaBase = new Date(ahora);
    const minutosActuales = fechaBase.getMinutes();
    const resto = minutosActuales % 5;
    
    if (resto !== 0) {
        // Si no es múltiplo de 5, lo empujamos al siguiente (ej. 33 -> 35)
        fechaBase.setMinutes(minutosActuales + (5 - resto));
    }
    fechaBase.setSeconds(0); // Limpiamos los segundos para mayor exactitud

    //Generamos el tiempo aleatorio a futuro (en saltos de 5 min)
    const intervalo = Math.floor(Math.random() * 144);
    const minutosEnElFuturo = intervalo * 5;

    //Sumamos ese futuro a nuestra fecha que ya está "limpia"
    const fechaVuelo = new Date(fechaBase.getTime() + (minutosEnElFuturo * 60000));

    //Lógica de estados: calculamos la diferencia REAL entre ahora y el vuelo
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

    //Formateo de fecha a texto
    const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
    const fechaFormateada = fechaVuelo.toLocaleDateString('es-ES', opciones);

    let horas = fechaVuelo.getHours();
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12;
    horas = horas ? horas : 12;
    
    //Como hicimos el ajuste arriba, esto SIEMPRE terminará en '0' o '5'
    const minutosStr = fechaVuelo.getMinutes().toString().padStart(2, '0');

    const textoFecha = `${fechaFormateada}, ${horas}:${minutosStr} ${ampm}`;

    return {
        fecha: textoFecha,
        estado: estadoVuelo,
        claseBadge: claseBadge 
    };

}




function generadorCodigoVuelo() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //2 Letras al azar
    const prefijo = letras.charAt(Math.floor(Math.random() * letras.length)) + letras.charAt(Math.floor(Math.random() * letras.length));

    //nro entre 1000 y 9999
    const numero = Math.floor(Math.random() * 9000) + 1000;

    return `${prefijo}-${numero}`;
};

function datosParaFormulario(codigo, ruta, fecha) {
    const url = `formulario.html?vuelo=${codigo}&ruta=${encodeURIComponent(ruta)}&fecha=${encodeURIComponent(fecha)}`;
    window.location.href = url;
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
            <div class="fila-cuadro" onclick="datosParaFormulario('${codigo}', '${ruta}', '${datosVuelo.fecha}')">
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
