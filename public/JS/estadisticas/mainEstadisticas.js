import { getData } from "../../services/CRUD.js"

const filtroNombre = document.getElementById("filtroNombre")
const categoriaConsulta = document.getElementById("categoriaConsulta")
const filtroSede = document.getElementById("filtroSede")
const filtroRevisadas = document.getElementById("filtroRevisadas")
const mostrarDatos = document.getElementById("mostrarDatos")

document.getElementById("back").addEventListener("click", irALista)
document.getElementById("aplicarFlitros").addEventListener("click", aplicarFiltros)
document.addEventListener("DOMContentLoaded", () => {
    actualizarLista()
    mostrarEstadisticas()
})

filtroRevisadas.addEventListener("change", () => {
    filtroRevisadas.value = filtroRevisadas.checked ? "Resuelta" : "Sin resolver"
})

function irALista() {
    window.location.href = "../pages/listaConsultas.html"
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
            const [dia, mes, año] = consulta.fecha.split("/")
            const fechaConsulta = new Date(`${año}-${mes}-${dia}`)
            const hoy = new Date()
            const tresDiasAtras = new Date()
            tresDiasAtras.setDate(hoy.getDate() - 3)
            if (fechaConsulta >= tresDiasAtras && fechaConsulta <= hoy) {
                crearMostrarConsulta(consulta, "contenedorCompletas")
            }
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

function crearMostrarConsulta(consulta, contenedor) {
    const contenedorTodas = document.getElementById(contenedor)
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

    contenedorConsulta.appendChild(nombre)
    contenedorConsulta.appendChild(hora)
    contenedorConsulta.appendChild(fecha)
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

    const nombreValor = filtroNombre.value.trim()
    const categoriaValor = categoriaConsulta.value.trim()
    const sedeValor = filtroSede.value.trim()
    const revisadasValor = filtroRevisadas.value.trim()

    const lista = revisadasValor === "Resuelta" ? consultasCompletas : consultas

    const filtradas = lista.filter(consulta => {
    const coincideNombre = nombreValor === "" || consulta.nombre.toLowerCase().includes(nombreValor.toLowerCase());
    const coincideCategoria = categoriaValor === "" || consulta.categoria === categoriaValor;
    const coincideSede = sedeValor === "" || consulta.sede === sedeValor;
    return coincideNombre && coincideCategoria && coincideSede;
});

    filtradas.forEach(consulta => {
        crearMostrarConsulta(consulta, "contenedorFiltro")
    })
}

function convertirFecha(fechaStr) {
    const partes = fechaStr.split("/")
    const dia = Number(partes[0])
    const mes = Number(partes[1]) - 1
    const año = Number(partes[2])
    return new Date(año, mes, dia)
}

async function mostrarEstadisticas() {
    mostrarDatos.innerHTML = ""

    const consultas = await obtenerDatos("consultas")
    const consultasResueltas = await obtenerDatos("consultasResueltas")

    const totalSolicitudes = consultas.length + consultasResueltas.length
    const totalRevisadas = consultasResueltas.length

    const hoy = new Date()
    const tresDiasAtras = new Date()
    tresDiasAtras.setDate(hoy.getDate() - 3)

    const revisadasUltimos3Dias = consultasResueltas.reduce(function(acc, consulta) {
        const fechaConsulta = convertirFecha(consulta.fecha)
        if (fechaConsulta >= tresDiasAtras && fechaConsulta <= hoy) {
            return acc + 1
        }
        return acc
    }, 0)

    const totalPorRevisar = consultas.length

    const solicitudesPorSede = [...consultas, ...consultasResueltas].reduce(function(acc, consulta) {
        const sede = consulta.sede
        acc[sede] = (acc[sede] || 0) + 1
        return acc
    }, {})

    const solicitudesPorCategoria = [...consultas, ...consultasResueltas].reduce(function(acc, consulta) {
        const categoria = consulta.categoria
        acc[categoria] = (acc[categoria] || 0) + 1
        return acc
    }, {})

    const pTotal = document.createElement("p")
    pTotal.textContent = "Solicitudes totales: " + totalSolicitudes
    mostrarDatos.appendChild(pTotal)

    const pRevisadas = document.createElement("p")
    pRevisadas.textContent = "Solicitudes revisadas: " + totalRevisadas
    mostrarDatos.appendChild(pRevisadas)

    const pRevisadas3Dias = document.createElement("p")
    pRevisadas3Dias.textContent = "Solicitudes revisadas (últimos 3 días): " + revisadasUltimos3Dias
    mostrarDatos.appendChild(pRevisadas3Dias)

    const pPorRevisar = document.createElement("p")
    pPorRevisar.textContent = "Solicitudes por revisar: " + totalPorRevisar
    mostrarDatos.appendChild(pPorRevisar)

    Object.keys(solicitudesPorSede).forEach(function(sede) {
        const cantidad = solicitudesPorSede[sede]
        const pSede = document.createElement("p")
        pSede.textContent = 'Solicitudes en sede "' + sede + '": ' + cantidad
        mostrarDatos.appendChild(pSede)
    })

    Object.keys(solicitudesPorCategoria).forEach(function(categoria) {
        const cantidad = solicitudesPorCategoria[categoria]
        const pCategoria = document.createElement("p")
        pCategoria.textContent = 'Solicitudes en categoría "' + categoria + '": ' + cantidad
        mostrarDatos.appendChild(pCategoria)
    })
}
