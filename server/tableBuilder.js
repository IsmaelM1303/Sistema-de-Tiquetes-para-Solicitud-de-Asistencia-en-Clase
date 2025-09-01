const { parseFechaDDMMYYYY } = require('./utils/fecha')

const buildEstadoTable = (consultas, consultasRevisadas) => {
    const total = consultas.length + consultasRevisadas.length
    const porRevisar = consultas.length
    const revisadasTotales = consultasRevisadas.length

    const hoy = new Date()
    const tresDiasAntes = new Date(hoy)
    tresDiasAntes.setDate(hoy.getDate() - 3)

    const recientes = consultasRevisadas.filter(c => {
        const fecha = parseFechaDDMMYYYY(c.fecha)
        return fecha && fecha >= tresDiasAntes && fecha <= hoy
    }).length

    return {
        title: 'Datos por estado de la consulta',
        headers: ['Estado', 'Cantidad'],
        rows: [
            ['Consultas totales', total],
            ['Consultas por revisar', porRevisar],
            ['Consultas revisadas totales', revisadasTotales],
            ['Consultas revisadas en los últimos 3 días', recientes]
        ]
    }
}

const buildCategoriaTable = (consultas, consultasResueltas, categorias) => {
    if (!Array.isArray(categorias)) throw new Error('"categorias" debe ser un array válido')

    const rows = []

    categorias.forEach(cat => {
        rows.push([cat])

        const revisadas = consultasResueltas.filter(c => c.categoria === cat).length
        const porRevisar = consultas.filter(c => c.categoria === cat).length

        rows.push(['Revisadas', revisadas, 'Por revisar', porRevisar])
    })

    return {
        title: 'Resumen por categoría',
        headers: ['Tipo', 'Cantidad', 'Tipo', 'Cantidad'],
        rows
    }
}

module.exports = { buildEstadoTable, buildCategoriaTable }      
