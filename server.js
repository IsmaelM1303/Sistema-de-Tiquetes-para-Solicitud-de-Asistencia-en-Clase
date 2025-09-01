const express = require('express')
const path = require('path')
const { generarReportePDF } = require('./server/generarPDF.js')

const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages/index.html'))
})

app.post('/generar-pdf', async (req, res) => {
    try {
        const { resumen, categorias } = req.body

        if (!Array.isArray(categorias)) {
            console.error('❌ Error: "categorias" debe ser un array')
            return res.status(400).send('El campo "categorias" debe ser un array válido')
        }

        console.log('📥 Datos recibidos para generar PDF:', { resumen, categorias })

        await generarReportePDF(res, { resumen, categorias })
    } catch (err) {
        console.error('❌ Error interno al generar el PDF:', err)
        res.status(500).send('Error interno al generar el PDF')
    }
})

app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
})
