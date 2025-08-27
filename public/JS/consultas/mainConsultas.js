//Importaciones
import { getData, createData } from "../../services/CRUD.js"
//Datos globales
const usuario = localStorage.getItem("Usuario")
const nombreUsuario = document.getElementById("nombreUsuario")
nombreUsuario.textContent = "Inició sesión como: " + usuario
const mensajeConfirmacion = document.getElementById("mensajeConfirmacion")


//Datos globales con triggers
document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion)
document.getElementById("btnestadisticas").addEventListener("click", irAEstadisticas)
document.getElementById("btnCrearConsulta").addEventListener("click", nuevaConsulta)




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
        descripcion: descripcionConsulta.value
    }

    //lo guardo y confirmo al usuario
    createData("consultas", nuevaConsulta)
    mostrarMensajeConfirmacion("Consulta creada")

    //Actualizo la lista
    actualizarLista()
}
function mostrarMensajeConfirmacion(texto, duracion = 1500) {
    mensajeConfirmacion.textContent = texto;

    setTimeout(() => {
        mensajeConfirmacion.textContent = "";
    }, duracion);
}

function actualizarLista(){

}

function cerrarSesion() {
    localStorage.setItem("Usuario", "");
    window.location.href = "../pages/index.html";
}

function irAEstadisticas() {
    window.location.href = "../pages/estadisticas.html";
}

