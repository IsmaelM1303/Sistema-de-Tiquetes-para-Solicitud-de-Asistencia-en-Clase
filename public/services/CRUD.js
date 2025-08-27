//Esta es la función que obtiene los datos
async function getData(endpoint) {
    try {
        const response = await fetch(`http://localhost:3001/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const usuarios = await response.json()
        return usuarios

    } catch (error) {
        console.log("Ocurrió un error al obtener los usuarios" + error)
    }
}

//Esta es la función que crea los usuarios
async function createData(endpoint, nuevoUsuario) {
    try {
        const response = await fetch(`http://localhost:3001/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        })

        const usuarios = await response.json()
        return usuarios

    } catch (error) {
        console.log("Ocurrió un error al crear el usuario" + error)
    }
}

//Esta es la función que elimina los usuarios
async function deleteData(endpoint, id) {
    try {
        const url = `http://localhost:3001/${endpoint}/` + id
        await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
    } catch (error) {
        console.log("Hubo un error al eliminar el usuario", error);

    }
}

//Esta es la función que actualiza los usuarios
async function updateData(endpoint, id, datosActualizados) {
    try {
        const url = `http://localhost:3001/${endpoint}/` + id
        await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        })
    } catch (error) {
        console.log("Hubo un error al modificar el usuario", error)
    }
}


export { getData, createData, updateData, deleteData }