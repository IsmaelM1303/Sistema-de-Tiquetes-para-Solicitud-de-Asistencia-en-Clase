//Importaciones
import { getData, createData, updateData } from "../../services/CRUD.js"

//Variables globales
const filtroNombre = document.getElementById("filtroNombre")
const categoriaConsulta = document.getElementById("categoriaConsulta")
const filtroSede = document.getElementById("filtroSede")
const filtroRevisadas = document.getElementById("filtroRevisadas")
const mostrarDatos = document.getElementById("mostrarDatos")
const nombreInput = document.getElementById("nombre")
const apellidoInput = document.getElementById("apellido")
const contrasenaInput = document.getElementById("contrasena")
const sedeSelect = document.getElementById("sede")

//Variables globales con triggers

if (localStorage.getItem("Usuario") !== "") {
    document.getElementById("btnCrearEstudiante").addEventListener("click", () => registrarUsuario("e"))
    document.getElementById("btnCrearProfesor").addEventListener("click", () => registrarUsuario("p"))
    document.getElementById("back").addEventListener("click", irALista)
    document.getElementById("aplicarFlitros").addEventListener("click", aplicarFiltros)
    document.addEventListener("DOMContentLoaded", () => {
        actualizarLista()
        mostrarEstadisticas()
    })

    filtroRevisadas.addEventListener("change", () => {
        filtroRevisadas.value = filtroRevisadas.checked ? "Resuelta" : "Sin resolver"
    })
} else {
    window.location.href = "../pages/index.html"
}

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

//Esto es para que las consultas que se impriman solo lo hagan bajo el estandar esperado
export async function actualizarLista() {
    const contenedorTodas = document.getElementById("contenedorTodas")
    const contenedorCompletas = document.getElementById("contenedorCompletas")
    try {
        const consultas = await obtenerDatos("consultas")
        const consultasCompletas = await obtenerDatos("consultasResueltas")
        contenedorTodas.innerHTML = ""
        texto("contenedorTodas", "Todas las consultas")
        texto("contenedorFiltro", "Consultas por filtro")
        texto("contenedorCompletas", "Consultas resueltas")
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

//Esto es para escribir texto
function texto(id, contenido) {
    const contenedor = document.getElementById(id)
    const texto = document.createElement("h2")
    texto.textContent = contenido
    contenedor.appendChild(texto)
}

//Esto es para que se impriman las consultas
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

//Esto es para que se muestren las consultas una vez filtradas
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
        const coincideNombre = nombreValor === "" || consulta.nombre?.toLowerCase().includes(nombreValor.toLowerCase())
        const coincideCategoria = categoriaValor === "" || consulta.categoria === categoriaValor
        const coincideSede = sedeValor === "" || consulta.sede === sedeValor
        return coincideNombre && coincideCategoria && coincideSede
    })

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

// Esto es para que se muestren las estadísticas
async function mostrarEstadisticas() {
    // Limpia el contenedor y agrega los canvas
    mostrarDatos.innerHTML = `
        <canvas id="graficoResumen" width="400" height="200"></canvas>
        <canvas id="graficoCategorias" width="400" height="200"></canvas>
    `

    const consultas = await obtenerDatos("consultas")
    const consultasResueltas = await obtenerDatos("consultasResueltas")

    const totalSolicitudes = consultas.length + consultasResueltas.length
    const totalRevisadas = consultasResueltas.length

    const hoy = new Date()
    const tresDiasAtras = new Date()
    tresDiasAtras.setDate(hoy.getDate() - 3)

    const revisadasUltimos3Dias = consultasResueltas.reduce((acc, consulta) => {
        const fechaConsulta = convertirFecha(consulta.fecha)
        return (fechaConsulta >= tresDiasAtras && fechaConsulta <= hoy) ? acc + 1 : acc
    }, 0)

    const totalPorRevisar = consultas.length

    const solicitudesPorCategoria = [...consultas, ...consultasResueltas].reduce((acc, consulta) => {
        const categoria = consulta.categoria
        acc[categoria] = (acc[categoria] || 0) + 1
        return acc
    }, {})

    // Gráfico de barras: resumen de solicitudes
    const ctxResumen = document.getElementById("graficoResumen").getContext("2d")
    new Chart(ctxResumen, {
        type: "bar",
        data: {
            labels: ["Totales", "Revisadas", "Revisadas (3 días)", "Por revisar"],
            datasets: [{
                label: "Solicitudes",
                data: [totalSolicitudes, totalRevisadas, revisadasUltimos3Dias, totalPorRevisar],
                backgroundColor: [
                    "#662D91", // morado
                    "#008FD4", // azul
                    "#F7901E", // naranja
                    "#FDCA06"  // amarillo
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Resumen de Solicitudes"
                }
            }
        }
    })

    // Gráfico de pastel: solicitudes por categoría
    const ctxCategorias = document.getElementById("graficoCategorias").getContext("2d")
    const categoriaColors = [
        "#662D91", "#EC008C", "#4D4D4D", "#F7901E", "#FDCA06", "#008FD4", "#20BEC6"
    ]
    const categoriasLabels = Object.keys(solicitudesPorCategoria)

    const chartCategorias = new Chart(ctxCategorias, {
        type: "pie",
        data: {
            labels: categoriasLabels,
            datasets: [{
                label: "Categorías",
                data: Object.values(solicitudesPorCategoria),
                backgroundColor: categoriasLabels.map((_, i) =>
                    categoriaColors[i % categoriaColors.length]
                )
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Distribución por Categoría"
                }
            }
        }
    })

    // Evento para seleccionar categoría en el gráfico y aplicar filtros
    document.getElementById("graficoCategorias").onclick = function (evt) {
        const activePoints = chartCategorias.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true)
        if (activePoints.length > 0) {
            const idx = activePoints[0].index
            const categoriaSeleccionada = chartCategorias.data.labels[idx]
            // Si la opción seleccionada es la que tiene id "sinCategoria", no hacer nada
            const opcionSinCategoria = categoriaConsulta.querySelector('#sinCategoria')
            if (opcionSinCategoria && opcionSinCategoria.value === categoriaSeleccionada) return
            categoriaConsulta.value = categoriaSeleccionada
            aplicarFiltros()
        }
    }
}

//Esto es para registrar usuarios
async function registrarUsuario(letra) {
    const nombreCompleto = nombreInput.value.trim() + " " + apellidoInput.value.trim()
    const contrasena = contrasenaInput.value.trim()
    const sede = sedeSelect.value.trim()

    // Verifica que todos los campos estén llenos
    if (!nombreInput.value.trim() || !apellidoInput.value.trim() || !contrasena || !sede) {
        alert("Por favor, complete todos los campos antes de registrar el usuario") //Cambiar esto por un mensaje -----------------
        return
    }

    const usuarios = await obtenerDatos("usuarios")
    const contadores = usuarios.find(u => u.id === "0")

    if (letra === "p") {
        const contador = parseInt(contadores.contadorProfesores)
        const contadorFormateado = contador < 10 ? "0" + contador : String(contador)
        const nuevoId = letra + "fwd" + contadorFormateado

        const nuevoUsuario = {
            id: nuevoId,
            nombre: nombreCompleto,
            contrasena: contrasena,
            sede: sede
        }

        await createData("usuarios", nuevoUsuario)

        const nuevoValor = contador + 1
        contadores.contadorProfesores = String(nuevoValor)
        await updateData("usuarios", contadores.id, contadores)

        limpiar()
    } else if (letra === "e") {
        const nuevoId = letra + "fwd" + contadores.contadorEstudiantes
        const nuevoUsuario = {
            id: nuevoId,
            nombre: nombreCompleto,
            contrasena: contrasena,
            sede: sede
        }
        await createData("usuarios", nuevoUsuario)
        const nuevoValor = parseInt(contadores.contadorEstudiantes) + 1
        contadores.contadorEstudiantes = String(nuevoValor)
        await updateData("usuarios", contadores.id, contadores)
        limpiar()
    }
}

function limpiar() {
    nombreInput.value = ""
    apellidoInput.value = ""
    contrasenaInput.value = ""
    sedeSelect.selectedIndex = 0
}