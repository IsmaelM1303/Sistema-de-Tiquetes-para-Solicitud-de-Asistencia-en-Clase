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
        consultas.forEach(consulta => {
            crearMostrarConsulta(consulta, "contenedorTodas")
        })
        consultasCompletas.forEach(consulta => {
            crearMostrarConsulta(consulta, "contenedorCompletas")
        })
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
    nombre.textContent = consulta.nombre
    nombre.classList.add("dato")

    const hora = document.createElement("p")
    hora.textContent = consulta.hora
    hora.classList.add("dato")

    const categoria = document.createElement("p")
    categoria.textContent = consulta.categoria
    categoria.classList.add("dato")

    const descripcion = document.createElement("p")
    descripcion.textContent = consulta.descripcion
    descripcion.classList.add("dato")

    const locacion = document.createElement("p")
    locacion.textContent = consulta.sede
    locacion.classList.add("dato")

    // Esto es para añadirlos al DOM
    contenedorConsulta.appendChild(nombre)
    contenedorConsulta.appendChild(hora)
    contenedorConsulta.appendChild(categoria)
    contenedorConsulta.appendChild(descripcion)
    contenedorConsulta.appendChild(locacion)

    contenedorTodas.appendChild(contenedorConsulta)
}


async function aplicarFiltros() {
    const contenedorFiltro = document.getElementById("contenedorFiltro")
    const consultas = await obtenerDatos("consultas")
    const consultasCompletas = await obtenerDatos("consultasResueltas")
    contenedorFiltro.innerHTML = ""
    
    
    
}