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

//array con tipos de estados para generar uno aleatorio, mayormente en reserva


function generarRuta(aeropuertos) {
    //se elige el origen
    let indiceOrigen = Math.floor(Math.random() * aeropuertos.lenght);
    let origen = aeropuertos[indiceOrigen];

    //ahora el destino
    let indiceDestino = Math.floor(Math.random() * aeropuertos.lenght);
    let destino = aeropuertos[indiceDestino];

    //bucle para cambiar el destino si es igual al origen
    while (origen === destino) {
        let indiceDestino = Math.floor(Math.random() * aeropuertos.lenght);
        let destino = aeropuertos[indiceDestino];
    }

    return '${origen} - ${destino}';
};



function generarFechaAleatoria() {
    //Se obtiene la fecha y hora exacta
    const ahora = new Date();

    //nro al azar entre 1 y 24
    const horasEnElFuturo = Math.floor(Math.random() * 24) + 1;

    //se le suman esas hora a nuestra hora actual para simular horarios
    ahora.setHours(ahora.getHours() + horasEnElFuturo);

    //nro entre 0 y 11 y se multiplica por 5
    const minutosMultiplo5 = Math.floor(Math.random() * 12) * 5;

    //se borran los minutos y se imponen los de la cuenta
    ahora.setMinutes(minutosMultiplo5)

    //formato dia/mes/anio
    const opciones = { day: '2-digit', month: 'short', year: 'numeric' };

    //se formatea a fecha en texto limpio
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);

    //hora formato militar
    let horas = ahora.getHours()

    //Si es 12 o mas PM, else AM
    const ampm = horas >= 12 ? 'PM' : 'AM';

    //hora militar a normal
    horas = horas % 12;
    horas = horas ? horas : 12; //si da medianoche (0), es 12

    //Extraemos minutos, si es un solo digito se le coloca 0 delante
    const minutos = ahora.getMinutes().toString().padStart(2, '0');

    return '${fechaFormateada}, ${horas}:${minutos} ${ampm}';
}

