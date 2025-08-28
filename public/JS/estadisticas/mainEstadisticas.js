//Importaciones
import { getData } from "../../services/CRUD.js";

//Datos globales
const filtroNombre = document.getElementById("filtroNombre")
const categoriaConsulta = document.getElementById("categoriaConsulta")
const filtroSede = document.getElementById("filtroSede")
const filtroRevisadas = document.getElementById("filtroRevisadas")


//Datos globales con triggers
document.getElementById("back").addEventListener("click", irALista)
document.getElementById("aplicarFlitros").addEventListener("click", aplicarFiltros)
document.addEventListener("DOMContentLoaded", () => {
    actualizarLista()
})

//Esto hace que el checkbox cambie su valor a lo que está en el db
filtroRevisadas.addEventListener("change", () => {
    filtroRevisadas.value = filtroRevisadas.checked ? "Resuelta" : "Sin resolver"
})

function irALista() {
    window.location.href = "../pages/listaConsultas.html";
}

async function obtenerDatos(tabla) {
    try {
        const consultas = await getData(tabla)
        return consultas
    } catch (error) {
        console.error("Ha ocurrido un error al intentar obtener los marcadores:", error)
        return []
    }
}

//Esto vuelve a crear la lista
export async function actualizarLista() {
    const contenedorTodas = document.getElementById("contenedorTodas")
    const contenedorCompletas = document.getElementById("contenedorCompletas")
    try {
        const consultas = await obtenerDatos("consultas")
        const consultasCompletas = await obtenerDatos("consultasResueltas")
        contenedorTodas.innerHTML = ""
        texto("contenedorTodas", "Todas las consultas")
        texto("contenedorFiltro", "Consultas por filtro")
        texto("contenedorCompletas", "Consultas completadas")
        //Esta imprime la sección izquierda de "Todas las consultas"
        consultas.forEach(consulta => {
            crearMostrarConsulta(consulta, "contenedorTodas")
        })
        //Esto es para que cumpla lo de los 3 días
        consultasCompletas.forEach(consulta => {
            const [dia, mes, año] = consulta.fecha.split("/");
            const fechaConsulta = new Date(`${año}-${mes}-${dia}`);
            const hoy = new Date();
            const tresDiasAtras = new Date();
            tresDiasAtras.setDate(hoy.getDate() - 3);

            // Solo muestra si está en los últimos 3 días
            if (fechaConsulta >= tresDiasAtras && fechaConsulta <= hoy) {
                crearMostrarConsulta(consulta, "contenedorCompletas");
            }
        });
    } catch (error) {
        console.error("Ocurrió un error al mostrar los marcadores:", error)
    }
}

function texto(id, contenido) {
    const contenedor = document.getElementById(id)
    const texto = document.createElement("h2")
    texto.textContent = contenido
    contenedor.appendChild(texto)
}

//Esto crea los elementos a mostrar en la lista de consultas
function crearMostrarConsulta(consulta, contenedor) {
    const contenedorTodas = document.getElementById(contenedor)
    // Aquí creo los elementos 
    const contenedorConsulta = document.createElement("div")
    const nombre = document.createElement("p")
    nombre.textContent = "Nombre del estudiante: " + consulta.nombre
    nombre.classList.add("dato")

    const hora = document.createElement("p")
    hora.textContent = "Hora: " + consulta.hora
    hora.classList.add("dato")

    const fecha = document.createElement("p")
    fecha.textContent = "Fecha: " + consulta.fecha
    fecha.classList.add("dato")

    const categoria = document.createElement("p")
    categoria.textContent = "Categoría: " + consulta.categoria
    categoria.classList.add("dato")

    const descripcion = document.createElement("p")
    descripcion.textContent = "Descripción de la consulta: " + consulta.descripcion
    descripcion.classList.add("dato")

    const locacion = document.createElement("p")
    locacion.textContent = "Sede: " + consulta.sede
    locacion.classList.add("dato")

    // Esto es para añadirlos al DOM
    contenedorConsulta.appendChild(nombre)
    contenedorConsulta.appendChild(hora)
    contenedorConsulta.appendChild(fecha)
    contenedorConsulta.appendChild(categoria)
    contenedorConsulta.appendChild(descripcion)
    contenedorConsulta.appendChild(locacion)

    contenedorTodas.appendChild(contenedorConsulta)
}


async function aplicarFiltros() {
    const contenedorFiltro = document.getElementById("contenedorFiltro");
    const consultas = await obtenerDatos("consultas");
    const consultasCompletas = await obtenerDatos("consultasResueltas");
    contenedorFiltro.innerHTML = "";

    // Obtén los valores de los filtros
    const nombreValor = filtroNombre.value.trim();
    const categoriaValor = categoriaConsulta.value.trim();
    const sedeValor = filtroSede.value.trim();
    const revisadasValor = filtroRevisadas.value.trim();

    // Elige el array según el filtro de revisadas
    const lista = revisadasValor === "Resuelta" ? consultasCompletas : consultas;

    // Filtra según los valores (si están vacíos, no filtra por ese campo)
    const filtradas = lista.filter(consulta => {
        const coincideNombre = nombreValor === "" || consulta.nombre.includes(nombreValor);
        const coincideCategoria = categoriaValor === "" || consulta.categoria === categoriaValor;
        const coincideSede = sedeValor === "" || consulta.sede === sedeValor;
        return coincideNombre && coincideCategoria && coincideSede;
    });

    // Imprime las consultas filtradas
    filtradas.forEach(consulta => {
        crearMostrarConsulta(consulta, "contenedorFiltro");
    });
}