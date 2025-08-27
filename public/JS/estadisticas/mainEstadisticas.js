//Importaciones
import { getData } from "../../services/CRUD.js";

document.getElementById("back").addEventListener("click", irALista)


function irALista(){
    window.location.href = "../pages/listaConsultas.html";
}



async function obtenerConsultas() {
    try {
        const consultas = await getData("consultas")
        return consultas
    } catch (error) {
        console.error("Ha ocurrido un error al intentar obtener los marcadores:", error)
        return []
    }
}

