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

//Esto vuelve a crear la lista
async function actualizarLista() {
    try {
        contenedorConsultas.innerHTML = ""
        const consultas = await obtenerConsultas()
        contenedorConsultas.innerHTML = ""

        consultas.forEach(consulta => {
            if (usuario.id.includes("e")) {
                crearMostrarEstudiante(consulta)
            }
            else if (usuario.id.includes("p")){
                crearMostrarProfesor(consulta)
            }
        })
    } catch (error) {
        console.error("Ocurrió un error al mostrar los marcadores:", error)
    }
}
