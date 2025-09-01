//Esto genera el PDF
const PDFDocument = require('pdfkit-table')
const { buildEstadoTable, buildCategoriaTable } = require('./tableBuilder')
const { fetchData } = require('./dataService')

const generarReportePDF = async (res, { resumen, categorias }) => {
    try {
        const { consultas, consultasResueltas } = await fetchData()
        console.log('📊 Datos recibidos:', {
            consultas: consultas.length,
            resueltas: consultasResueltas.length
        })

        if (!Array.isArray(categorias)) {
            throw new Error('"categorias" debe ser un array válido')
        }

        const doc = new PDFDocument({ margin: 30 })
        const chunks = []
        doc.on('data', chunk => chunks.push(chunk))
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks)
            res
                .status(200)
                .set({
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="informe.pdf"'
                })
                .send(pdfBuffer)
        })

        // Tabla de estado
        const estadoTable = buildEstadoTable(consultas, consultasResueltas)
        console.log('🧾 Tabla de estado:', estadoTable.rows)

        doc.fontSize(16).text(estadoTable.title, { underline: true })
        await doc.table({
            headers: estadoTable.headers,
            rows: estadoTable.rows
        })

        doc.moveDown()

        // Tabla de categorías
        const categoriaTable = buildCategoriaTable(consultas, consultasResueltas, categorias)
        console.log('🧾 Tabla de categorías:', categoriaTable.rows)

        doc.fontSize(16).text(categoriaTable.title, { underline: true })
        await doc.table({
            headers: categoriaTable.headers,
            rows: categoriaTable.rows
        })

        doc.end()
    } catch (err) {
        console.error('❌ Error al construir el PDF:', err)
        res.status(500).send('Error al construir el PDF')
    }
}

module.exports = { generarReportePDF }
