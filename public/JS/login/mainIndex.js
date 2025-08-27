//Importaciones
import { getUser } from "../../services/peticioneslogin.js"

document.getElementById("btnInicioSesion").addEventListener("click", validarLogin)

async function validarLogin(e) {
    e.preventDefault()

    const idInput = document.getElementById("idLogin").value.trim().toLowerCase()
    const passwordInput = document.getElementById("passwordLogin").value.trim()

    if (!idInput || !passwordInput) {
        console.warn("Por favor, ingrese nombre y contraseña")
        return
    }

    const usuarios = await getUser()
    const usuarioValido = usuarios.find(usuario =>
        usuario.id === idInput && usuario.contrasena === passwordInput
    )

    if (usuarioValido) {
        localStorage.setItem("Usuario", usuarioValido.nombre);
        window.location.href = "../pages/listaConsultas.html";

    } else {
        console.warn("Usuario o contraseña incorrectos")
    }
}