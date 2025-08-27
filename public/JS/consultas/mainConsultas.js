//Importaciones

//Datos globales
const usuario = localStorage.getItem("Usuario")
const nombreUsuario = document.getElementById("nombreUsuario")
nombreUsuario.textContent = "Inició sesión como: "+ usuario


//Datos globales con triggers
document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion)
document.getElementById("estadisticas").addEventListener("click", irAEstadisticas)






function cerrarSesion(){
    localStorage.setItem("Usuario", "");
    window.location.href = "../pages/index.html";
}

function irAEstadisticas(){
    window.location.href = "../pages/estadisticas.html";
}

