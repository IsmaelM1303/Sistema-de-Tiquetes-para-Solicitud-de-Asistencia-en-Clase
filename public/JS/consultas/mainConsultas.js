document.getElementById("btnCerrarSesion").addEventListener("click", iniciarSesion)
document.getElementById("estadisticas").addEventListener("click", irAEstadisticas)


function iniciarSesion(){
    window.location.href = "../pages/index.html";
}

function irAEstadisticas(){
    window.location.href = "../pages/estadisticas.html";
}

