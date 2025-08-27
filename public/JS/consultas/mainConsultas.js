document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion)
document.getElementById("estadisticas").addEventListener("click", irAEstadisticas)

const usuarioRecuperado = JSON.parse(localStorage.getItem("Usuario"));

function cerrarSesion(){
    localStorage.setItem("Usuario", "");
    window.location.href = "../pages/index.html";
}

function irAEstadisticas(){
    window.location.href = "../pages/estadisticas.html";
}

