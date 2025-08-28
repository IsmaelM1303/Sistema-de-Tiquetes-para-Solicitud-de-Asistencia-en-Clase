//Importaciones
import { getData, createData, updateData } from "../../services/CRUD.js"
import { crearMostrarEstudiante, crearMostrarProfesor } from "../renders.js"
//Datos globales
const usuario = JSON.parse(localStorage.getItem("Usuario"))
const nombreUsuario = document.getElementById("nombreUsuario")

nombreUsuario.textContent = "Inició sesión como: " + usuario.nombre + " | Sede: " + usuario.sede

const mensajeConfirmacion = document.getElementById("mensajeConfirmacion")
const contenedorConsultas = document.getElementById("contenedorConsultas")


//Datos globales con triggers

//Esto es la renderización condicional con js puro
if (usuario.id.includes("p")) {
    console.log("profe");
    const btnEstadistica = document.createElement("button")
    btnEstadistica.textContent = "Estadísticas"
    btnEstadistica.id = "btnEstadistica"
    const botonEstadistica = document.getElementById("botonEstadistica")
    botonEstadistica.appendChild(btnEstadistica)

    btnCerrarSesion.addEventListener("click", cerrarSesion)
    document.getElementById("btnEstadistica").addEventListener("click", irAEstadisticas)
    document.addEventListener("DOMContentLoaded", () => { actualizarLista() })


} else if (usuario.id.includes("e")) {
    console.log("estudiante");
    const contenedorAgregar = document.getElementById("contenedorAgregar");

    // Crear título
    const titulo = document.createElement("h3");
    titulo.textContent = "Nuevo tiquete de consulta";

    // Crear etiqueta de categoría
    const labelCategoria = document.createElement("label");
    labelCategoria.textContent = "Selecciona una categoría para la consulta:";

    // Crear select de categorías
    const selectCategoria = document.createElement("select");
    selectCategoria.id = "categoriaConsulta";
    selectCategoria.name = "tecnologia";

    // Opciones del select
    const categorias = [
        { value: "", text: "Seleccionar categoría", disabled: true, selected: true },
        { value: "javascript", text: "JavaScript" },
        { value: "css", text: "CSS" },
        { value: "html", text: "HTML" },
        { value: "nodejs", text: "Node.js" },
        { value: "jsonserver", text: "json-server" },
        { value: "react", text: "React" },
        { value: "python", text: "Python" },
        { value: "github", text: "GitHub" },
        { value: "otro", text: "Otro" }
    ];

    categorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.value;
        option.textContent = cat.text;
        if (cat.disabled) option.disabled = true;
        if (cat.selected) option.selected = true;
        selectCategoria.appendChild(option);
    });

    // Crear contenedor de categoría
    const divCategoria = document.createElement("div");
    divCategoria.appendChild(titulo);
    divCategoria.appendChild(labelCategoria);
    divCategoria.appendChild(selectCategoria);

    // Crear etiqueta de descripción
    const labelDescripcion = document.createElement("label");
    labelDescripcion.textContent = "Describa el motivo de su consulta";

    // Crear textarea
    const textarea = document.createElement("textarea");
    textarea.id = "descripcionConsulta";

    // Crear contenedor de descripción
    const divDescripcion = document.createElement("div");
    divDescripcion.appendChild(labelDescripcion);
    divDescripcion.appendChild(textarea);

    // Crear botón
    const boton = document.createElement("button");
    boton.id = "btnCrearConsulta";
    boton.textContent = "Crear consulta";

    // Crear párrafo de confirmación
    const mensaje = document.createElement("p");
    mensaje.id = "mensajeConfirmacion";

    // Agregar todo al contenedor principal
    contenedorAgregar.appendChild(divCategoria);
    contenedorAgregar.appendChild(divDescripcion);
    contenedorAgregar.appendChild(boton);
    contenedorAgregar.appendChild(mensaje);

    document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion)
    document.getElementById("btnCrearConsulta").addEventListener("click", nuevaConsulta)
    document.addEventListener("DOMContentLoaded", () => { actualizarLista() })
}



//Esto obtiene los usuarios
async function obtenerConsultas() {
    try {
        const consultas = await getData("consultas")
        return consultas
    } catch (error) {
        console.error("Ha ocurrido un error al intentar obtener los marcadores:", error)
        return []
    }
}

//Esto vuelve a crear la lista
export async function actualizarLista() {
    contenedorConsultas.innerHTML = ""
    try {
        const consultas = await obtenerConsultas()
        contenedorConsultas.innerHTML = ""

        consultas.forEach(consulta => {
            if (consulta.estado === "Sin resolver") {
                if (usuario.id.includes("e")) {
                    crearMostrarEstudiante(consulta)
                }
                else if (usuario.id.includes("p")) {
                    crearMostrarProfesor(consulta)
                }
            }
        })
    } catch (error) {
        console.error("Ocurrió un error al mostrar los marcadores:", error)
    }
}

//Esto crea una nueva consulta
function nuevaConsulta() {
    const categoriaConsulta = document.getElementById("categoriaConsulta")
    const descripcionConsulta = document.getElementById("descripcionConsulta")
    //Saco la hora y la fecha
const ahora = new Date()

const horas = String(ahora.getHours()).padStart(2, '0')
const minutos = String(ahora.getMinutes()).padStart(2, '0')
const segundos = String(ahora.getSeconds()).padStart(2, '0')

const dia = String(ahora.getDate()).padStart(2, '0')
const mes = String(ahora.getMonth() + 1).padStart(2, '0') // los meses van de 0 a 11
const año = ahora.getFullYear()

const horaFormateada = `${horas}:${minutos}:${segundos}`
const fechaFormateada = `${dia}/${mes}/${año}`


    //Hago el objeto
    const nuevaConsulta = {
        nombre: usuario.nombre,
        hora: horaFormateada,
        fecha: fechaFormateada,
        categoria: categoriaConsulta.value,
        descripcion: descripcionConsulta.value,
        sede: usuario.sede,
        estado: "Sin resolver"

    }

    //lo guardo y confirmo al usuario
    createData("consultas", nuevaConsulta)
    mostrarMensajeConfirmacion("Consulta creada")

    //Actualizo la lista
    actualizarLista()
}


//Esto da un mensaje
function mostrarMensajeConfirmacion(texto, duracion = 1500) {
    mensajeConfirmacion.textContent = texto;

    setTimeout(() => {
        mensajeConfirmacion.textContent = "";
    }, duracion);
}

function cerrarSesion() {
    localStorage.setItem("Usuario", "");
    window.location.href = "../pages/index.html";
}

function irAEstadisticas() {
    window.location.href = "../pages/estadisticas.html";
}

