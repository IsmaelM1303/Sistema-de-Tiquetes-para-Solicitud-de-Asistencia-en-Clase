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
        const datos = await getData(tabla)
        return datos
    } catch (error) {
        console.error("Ha ocurrido un error al intentar obtener los datos:", error)
        return []
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
    nombre.textContent = "Nombre del estudiante: " + (consulta.nombre || "")
    nombre.classList.add("dato")

    const hora = document.createElement("p")
    hora.textContent = "Hora: " + (consulta.hora || "")
    hora.classList.add("dato")

    const fecha = document.createElement("p")
    fecha.textContent = "Fecha: " + (consulta.fecha || "")
    fecha.classList.add("dato")

    const categoria = document.createElement("p")
    categoria.textContent = "Categoría: " + (consulta.categoria || "")
    categoria.classList.add("dato")

    const descripcion = document.createElement("p")
    descripcion.textContent = "Descripción de la consulta: " + (consulta.descripcion || "")
    descripcion.classList.add("dato")

    const locacion = document.createElement("p")
    locacion.textContent = "Sede: " + (consulta.sede || "")
    locacion.classList.add("dato")

    // Botón para dar por resuelta la consulta
    const botonRevisar = document.createElement("button")
    botonRevisar.textContent = "Dar por resuelta"
    botonRevisar.classList.add("dato", "boton-consulta")
    botonRevisar.addEventListener("click", async () => {
        // Inputs para editar
        const inputNombre = document.createElement("input")
        inputNombre.value = consulta.nombre || ""

        const selectCategoria = document.createElement("select")
        // Opciones de categoría (puedes mejorarlo según tus categorías)
        const option = document.createElement("option")
        option.value = consulta.categoria || ""
        option.textContent = consulta.categoria || ""
        selectCategoria.appendChild(option)

        const textareaDescripcion = document.createElement("textarea")
        textareaDescripcion.value = consulta.descripcion || ""

        const inputSede = document.createElement("input")
        inputSede.value = consulta.sede || ""

        const datosActualizados = {
            id: consulta.id,
            nombre: inputNombre.value,
            hora: consulta.hora,
            fecha: consulta.fecha,
            categoria: selectCategoria.value,
            descripcion: textareaDescripcion.value,
            sede: inputSede.value,
            estado: "Resuelta"
        }

        await updateData("consultas", consulta.id, datosActualizados)
        actualizarLista()
    })

    contenedorConsulta.appendChild(nombre)
    contenedorConsulta.appendChild(hora)
    contenedorConsulta.appendChild(fecha)
    contenedorConsulta.appendChild(categoria)
    contenedorConsulta.appendChild(descripcion)
    contenedorConsulta.appendChild(locacion)
    contenedorConsulta.appendChild(botonRevisar)

    contenedorTodas.appendChild(contenedorConsulta)
}

//Esto es para que las consultas que se impriman solo lo hagan bajo el estandar esperado
export async function actualizarLista() {
    const contenedorTodas = document.getElementById("contenedorTodas")
    const contenedorCompletas = document.getElementById("contenedorCompletas")
    try {
        const consultas = await obtenerDatos("consultas")
        const consultasCompletas = await obtenerDatos("consultasResueltas")
        contenedorTodas.innerHTML = ""
        contenedorCompletas.innerHTML = ""
        texto("contenedorTodas", "Todas las consultas")
        texto("contenedorFiltro", "Consultas por filtro")
        texto("contenedorCompletas", "Consultas resueltas")
        consultas.forEach(consulta => {
            crearMostrarConsulta(consulta, "contenedorTodas")
        })
        consultasCompletas.forEach(consulta => {
            if (consulta.fecha) {
                const [dia, mes, año] = consulta.fecha.split("/")
                const fechaConsulta = new Date(`${año}-${mes}-${dia}`)
                const hoy = new Date()
                const tresDiasAtras = new Date()
                tresDiasAtras.setDate(hoy.getDate() - 3)
                if (fechaConsulta >= tresDiasAtras && fechaConsulta <= hoy) {
                    crearMostrarConsulta(consulta, "contenedorCompletas")
                }
            }
        })
    } catch (error) {
        console.error("Ocurrió un error al mostrar los marcadores:", error)
    }
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
        const coincideNombre = nombreValor === "" || (consulta.nombre && consulta.nombre.toLowerCase().includes(nombreValor.toLowerCase()))
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
    const mostrarDatos = document.getElementById("mostrarDatos")

    mostrarDatos.innerHTML = `
        <canvas id="graficoResumen" width="400" height="200"></canvas>
        <canvas id="graficoCategorias" width="400" height="200"></canvas>
        <div>
            <button id="btnGenerarReporte">Generar reporte PDF</button>
        </div>
    `

    const consultas = await obtenerDatos("consultas")
    const consultasResueltas = await obtenerDatos("consultasResueltas")

    const totalSolicitudes = consultas.length + consultasResueltas.length
    const totalRevisadas = consultasResueltas.length

    const hoy = new Date()
    const tresDiasAtras = new Date()
    tresDiasAtras.setDate(hoy.getDate() - 3)

    const revisadasUltimos3Dias = consultasResueltas.reduce((acc, consulta) => {
        if (consulta.fecha) {
            const fechaConsulta = convertirFecha(consulta.fecha)
            return (fechaConsulta >= tresDiasAtras && fechaConsulta <= hoy) ? acc + 1 : acc
        }
        return acc
    }, 0)

    const totalPorRevisar = consultas.length

    const solicitudesPorCategoria = [...consultas, ...consultasResueltas].reduce((acc, consulta) => {
        if (consulta.categoria) {
            acc[consulta.categoria] = (acc[consulta.categoria] || 0) + 1
        }
        return acc
    }, {})


    const ctxResumen = document.getElementById("graficoResumen").getContext("2d")
    new Chart(ctxResumen, {
        type: "bar",
        data: {
            labels: ["Totales", "Revisadas", "Revisadas (3 días)", "Por revisar"],
            datasets: [{
                label: "Solicitudes",
                data: [totalSolicitudes, totalRevisadas, revisadasUltimos3Dias, totalPorRevisar],
                backgroundColor: ["#662D91", "#008FD4", "#F7901E", "#FDCA06"]
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

    const ctxCategorias = document.getElementById("graficoCategorias").getContext("2d")
    const categoriaColors = ["#662D91", "#EC008C", "#4D4D4D", "#F7901E", "#FDCA06", "#008FD4", "#20BEC6"]
    const categoriasLabels = Object.keys(solicitudesPorCategoria)

    const chartCategorias = new Chart(ctxCategorias, {
        type: "pie",
        data: {
            labels: categoriasLabels,
            datasets: [{
                label: "Categorías",
                data: Object.values(solicitudesPorCategoria),
                backgroundColor: categoriasLabels.map((_, i) => categoriaColors[i % categoriaColors.length])
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

    document.getElementById("graficoCategorias").addEventListener("click", e => {
        const punto = chartCategorias.getElementsAtEventForMode(e, "nearest", { intersect: true }, true)[0]
        if (!punto) return

        const label = chartCategorias.data.labels[punto.index]
        const valor = label.toLowerCase().replace(/\s+/g, "")

        const select = document.getElementById("categoriaConsulta")
        select.value = valor

        document.getElementById("aplicarFlitros").click()
    })



    document.getElementById('btnGenerarReporte').addEventListener('click', async () => {
        try {
            const response = await fetch('/generar-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumen: true,
                    categorias: [
                        'javascript', 'css', 'html', 'nodejs', 'jsonserver',
                        'react', 'python', 'github', 'otro'
                    ]
                })
            })

            if (!response.ok) throw new Error('Error al generar el PDF')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = 'informe.pdf'
            a.click()
        } catch (err) {
            console.error('❌', err)
        }
    })




}



//Esto es para registrar usuarios
async function registrarUsuario(letra) {
    const nombreCompleto = nombreInput.value.trim() + " " + apellidoInput.value.trim()
    const contrasena = contrasenaInput.value.trim()
    const sede = sedeSelect.value.trim()

    if (!nombreInput.value.trim() || !apellidoInput.value.trim() || !contrasena || !sede) {
        alert("Por favor, complete todos los campos antes de registrar el usuario")
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