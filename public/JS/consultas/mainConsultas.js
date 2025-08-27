//Importaciones
import { getData, createData } from "../../services/CRUD.js"
//Datos globales
const usuario = JSON.parse(localStorage.getItem("Usuario"))
const nombreUsuario = document.getElementById("nombreUsuario")

nombreUsuario.textContent = "Inició sesión como: " + usuario.nombre +" | Sede: " +usuario.sede

const mensajeConfirmacion = document.getElementById("mensajeConfirmacion")
const contenedorConsultas = document.getElementById("contenedorConsultas")


//Datos globales con triggers
document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion)
document.getElementById("btnestadisticas").addEventListener("click", irAEstadisticas)
document.getElementById("btnCrearConsulta").addEventListener("click", nuevaConsulta)
document.addEventListener("DOMContentLoaded", () => { actualizarLista() })



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
async function actualizarLista() {
    try {
        contenedorConsultas.innerHTML = ""
        const consultas = await obtenerConsultas()
        contenedorConsultas.innerHTML = ""

        consultas.forEach(consulta => {
            crearMostrar(consulta)
        })
    } catch (error) {
        console.error("Ocurrió un error al mostrar los marcadores:", error)
    }
}

//Esto crea los elementos a mostrar en la lista de consultas
function crearMostrar(consulta) {
    const contenedorConsulta = document.createElement("div")

    // Aquí creo los elementos
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

    contenedorConsultas.appendChild(contenedorConsulta)
}



//Esto crea una nueva consulta
function nuevaConsulta() {
    const categoriaConsulta = document.getElementById("categoriaConsulta")
    const descripcionConsulta = document.getElementById("descripcionConsulta")
    //Saco la hora
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    const horaFormateada = `${horas}:${minutos}:${segundos}`;

    //Hago el objeto
    const nuevaConsulta = {
        nombre: usuario,
        hora: horaFormateada,
        categoria: categoriaConsulta.value,
        descripcion: descripcionConsulta.value,
        sede: usuario.sede
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

