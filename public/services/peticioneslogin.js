//Esta es la función que lee las películas
async function getUser() {
    try {
        const response = await fetch('http://localhost:3001/usuarios', {
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

export {getUser}