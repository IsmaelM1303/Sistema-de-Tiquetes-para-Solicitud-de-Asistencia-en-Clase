//Importaciones
import { getData } from "../../services/CRUD.js"

//Datos globales
document.getElementById("btnInicioSesion").addEventListener("click", validarLogin)

//Funcion de inicio de sesión
async function validarLogin(e) {
    e.preventDefault()

    //Recuperación de datos
    const idInput = document.getElementById("idLogin").value.trim().toLowerCase()
    const passwordInput = document.getElementById("passwordLogin").value.trim()
    const mensaje = document.getElementById("mensaje")

    //Validación de espacios completos
    if (!idInput || !passwordInput) {
        mensaje.textContent = "Por favor, ingrese nombre y contraseña"
        setTimeout(() => {
            mensaje.textContent = ""
        }, 1500);
        return
    }

    //Verificación con la db.json
    const usuarios = await getData("usuarios")
    const usuarioValido = usuarios.find(usuario =>
        usuario.id === idInput && usuario.contrasena === passwordInput
    )

    if (usuarioValido) {
        const datosUsuario = {
            id: usuarioValido.id,
            nombre: usuarioValido.nombre,
            sede: usuarioValido.sede
        }

        localStorage.setItem("Usuario", JSON.stringify(datosUsuario))
        window.location.href = "../pages/listaConsultas.html";

    } else {
        console.warn("Usuario o contraseña incorrectos")
        const mensaje = document.getElementById("mensaje")
        mensaje.textContent = "Usuario o contraseña incorrectos"
        setTimeout(() => {
            mensaje.textContent = ""
        }, 1500);
    }
}

