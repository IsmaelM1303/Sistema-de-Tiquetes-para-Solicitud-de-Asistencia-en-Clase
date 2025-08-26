const express = require('express');
const app = express();
const PORT = 3000;

// Middleware opcional para parsear JSON
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
    res.send('Servidor educativo activo en el puerto 3000');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
