// servidor/generarPDF.js
const PDFDocument = require('pdfkit-table')   // <- PDFDocumentWithTables
const { buildEstadoTable, buildCategoriaTable } = require('./tableBuilder')
const { fetchData } = require('./dataService')

const generarReportePDF = async (res, { resumen, categorias }) => {
    try {
        // 1) Trae datos
        const { consultas, consultasResueltas } = await fetchData()
        console.log('📊 Datos recibidos:', {
            consultas: consultas.length,
            resueltas: consultasResueltas.length
        })

        // 2) Valida categorías
        if (!Array.isArray(categorias)) {
            throw new Error('"categorias" debe ser un array válido')
        }

        // 3) Crea documento con la clase extendida
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

        // 4) Tabla de estado
        const estadoTable = buildEstadoTable(consultas, consultasResueltas)
        doc.fontSize(16).text(estadoTable.title, { underline: true })
        await doc.table({
            headers: estadoTable.headers,
            rows: estadoTable.rows
        })

        doc.moveDown()

        // 5) Tabla de categorías
        const categoriaTable = buildCategoriaTable(consultas, consultasResueltas, categorias)
        doc.fontSize(16).text(categoriaTable.title, { underline: true })
        await doc.table({
            headers: categoriaTable.headers,
            rows: categoriaTable.rows
        })

        // 6) Finaliza
        doc.end()
    } catch (err) {
        console.error('❌ Error al construir el PDF:', err)
        res.status(500).send('Error al construir el PDF')
    }
}

module.exports = { generarReportePDF }
