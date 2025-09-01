const axios = require('axios')
const BASE_URL = 'http://localhost:3001'

const fetchData = async () => {
    try {
        // Solo pedimos los endpoints que realmente existen
        const [consultasRes, consultasResueltasRes] = await Promise.all([
            axios.get(`${BASE_URL}/consultas`),
            axios.get(`${BASE_URL}/consultasResueltas`)
        ])

        return {
            consultas: consultasRes.data,
            // Dejamos consultasRevisadas como array vacío para no romper la firma
            consultasRevisadas: [],
            consultasResueltas: consultasResueltasRes.data
        }
    } catch (err) {
        console.error('❌ Error al obtener datos desde json-server:', err.message)
        throw err
    }
}

module.exports = { fetchData }
