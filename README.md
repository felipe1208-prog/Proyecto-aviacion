# ✈️ OS Airlines - Sistema de Reservación de Vuelos Web

## 📌 Descripción del Proyecto
OS Airlines es una aplicación web interactiva desarrollada para simular el flujo completo de reservación de boletos aéreos comerciales. El sistema abarca desde la selección de origen/destino y registro de pasajeros, hasta la asignación de asientos y la generación dinámica de pases de abordar (Boarding Passes). 

El proyecto destaca por su enfoque arquitectónico en **Vanilla JavaScript**, prescindiendo de frameworks externos para demostrar un dominio absoluto sobre la manipulación del DOM, gestión de eventos y persistencia de datos en el cliente.

## ✨ Características Principales (Features)

* **Flujo de Reserva Dinámico:** Navegación por fases (Formulario -> Selección de Asientos -> Confirmación) manteniendo la persistencia de datos a través de `sessionStorage`.
* **Motor de Selección de Asientos Inteligente:**
  * Mapeo visual interactivo del fuselaje del avión.
  * **Reglas de Negocio Integradas:** Validación estricta para las filas de Salida de Emergencia mediante modales de aceptación de responsabilidades.
* **Generación de Pases de Abordar en Tiempo Real:** * Inyección dinámica de HTML para renderizar tickets tipo carnet de identidad.
  * Inclusión automática de Códigos QR, datos del pasajero, segmentación de clase (Turista/Económica) y cálculo de equipaje.
* **UI/UX y Diseño Defensivo:**
  * Implementación de "Fricción Intencional" para la eliminación de boletos (ubicación estratégica del botón y doble confirmación) para evitar borrados accidentales.
  * Sistema de diseño basado en variables CSS globales (`:root`) para mantener la coherencia corporativa (colores primarios, tipografías).
  * Modales globales inyectados desde JavaScript para evitar redundancia de código en los archivos HTML.

## 🛠️ Stack Tecnológico

* **Frontend:** HTML5 Semántico.
* **Estilos:** CSS3 Puro (Flexbox, CSS Grid, Custom Properties, Webkit Scrollbars personalizadas).
* **Lógica:** Vanilla JavaScript (ES6+).
* **Almacenamiento:** Browser Session Storage API.

## ⚙️ Arquitectura y Toma de Decisiones

1. **Manipulación del DOM:** Se optó por construir modales y estructuras repetitivas (como el renderizado del historial de vuelos) utilizando `insertAdjacentHTML` y `createElement` directamente desde el motor JS, garantizando que los componentes globales estén disponibles sin importar la vista actual del usuario.
2. **Gestión del Estado:** Se utilizó un modelo de objetos JSON serializados en el `sessionStorage`. Esto permite aislar la sesión actual del usuario, limpiando el historial al finalizar la reserva o cerrar el navegador por motivos de seguridad.
3. **Responsive Design "Estricto":** Uso de funciones CSS matemáticas como `calc()` para asegurar que la renderización de cuadrículas (Grid) no se rompa por elementos del sistema operativo, como las barras de desplazamiento nativas.

## 🚀 Instalación y Uso

Dado que el proyecto está desarrollado del lado del cliente sin dependencias de Node.js ni bundlers, su ejecución es directa:

1. Clona este repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/os-airlines.git](https://github.com/felipe1208-prog/Proyecto-aviacion.git)