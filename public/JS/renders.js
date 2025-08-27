import { updateData, createData, deleteData} from "../services/CRUD.js"
import { actualizarLista, } from "./consultas/mainConsultas.js"

//Esto crea los elementos a mostrar en la lista de consultas
function crearMostrarEstudiante(consulta) {
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

function crearMostrarProfesor(consulta) {
    const contenedor = document.createElement("div")

    // Campo: Nombre
    const labelNombre = document.createElement("label")
    labelNombre.htmlFor = "nombre-" + consulta.id
    labelNombre.textContent = "Nombre del profesor"

    const inputNombre = document.createElement("input")
    inputNombre.type = "text"
    inputNombre.id = "nombre-" + consulta.id
    inputNombre.value = consulta.nombre
    inputNombre.classList.add("dato")

    const grupoNombre = document.createElement("div")
    grupoNombre.append(labelNombre, inputNombre)

    // Campo: Hora (solo visual)
    const grupoHora = document.createElement("div")
    const hora = document.createElement("p")
    hora.textContent = "Hora de la consulta: " + consulta.hora
    hora.classList.add("dato")
    grupoHora.appendChild(hora)

    // Campo: Categoría (select)
    const grupoCategoria = document.createElement("div")

    const labelCategoria = document.createElement("label")
    labelCategoria.htmlFor = "categoria-" + consulta.id
    labelCategoria.textContent = "Categoría"

    const selectCategoria = document.createElement("select")
    selectCategoria.id = "categoria-" + consulta.id
    selectCategoria.name = "tecnologia"
    selectCategoria.classList.add("dato")

    const opciones = [
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
    ]

    opciones.forEach(op => {
        const option = document.createElement("option")
        option.value = op.value
        option.textContent = op.text
        if (op.disabled) option.disabled = true
        if (op.selected || op.value === consulta.categoria) option.selected = true
        selectCategoria.appendChild(option)
    })

    grupoCategoria.append(labelCategoria, selectCategoria)

    // Campo: Descripción (textarea)
    const labelDescripcion = document.createElement("label")
    labelDescripcion.htmlFor = "descripcion-" + consulta.id
    labelDescripcion.textContent = "Descripción"

    const textareaDescripcion = document.createElement("textarea")
    textareaDescripcion.id = "descripcion-" + consulta.id
    textareaDescripcion.value = consulta.descripcion
    textareaDescripcion.classList.add("dato")

    const grupoDescripcion = document.createElement("div")
    grupoDescripcion.append(labelDescripcion, textareaDescripcion)

    // Campo: Sede
    const labelSede = document.createElement("label")
    labelSede.htmlFor = "locacion-" + consulta.id
    labelSede.textContent = "Sede"

    const inputSede = document.createElement("input")
    inputSede.type = "text"
    inputSede.id = "locacion-" + consulta.id
    inputSede.value = consulta.sede
    inputSede.classList.add("dato")

    const grupoSede = document.createElement("div")
    grupoSede.append(labelSede, inputSede)

    // Botón: Guardar
    const botonGuardar = document.createElement("button")
    botonGuardar.textContent = "Guardar cambios"
    botonGuardar.addEventListener("click", () => {
        const datosActualizados = {
            id: consulta.id,
            nombre: inputNombre.value,
            hora: consulta.hora,
            categoria: selectCategoria.value,
            descripcion: textareaDescripcion.value,
            sede: inputSede.value
        }
        updateData("consultas", consulta.id, datosActualizados)
        actualizarLista()
    })

    //Botón: Dar por resuelta
    const botonRevisar = document.createElement("button")
    botonRevisar.textContent = "Dar por resuelta"
    botonRevisar.addEventListener("click", () => {
        const datosActualizados = {
            id: consulta.id,
            nombre: inputNombre.value,
            hora: consulta.hora,
            categoria: selectCategoria.value,
            descripcion: textareaDescripcion.value,
            sede: inputSede.value
        }
        createData("consultasResueltas", datosActualizados)
        deleteData("consultas", consulta.id)
        actualizarLista()
    })

    // Ensamblar todo
    contenedor.append(
        grupoNombre,
        grupoHora,
        grupoCategoria,
        grupoDescripcion,
        grupoSede,
        botonGuardar,
        botonRevisar
    )

    contenedorConsultas.appendChild(contenedor)
}

export {crearMostrarEstudiante, crearMostrarProfesor}