// Convierte una fecha en formato "DD/MM/YYYY" a objeto Date válido
function parseFechaDDMMYYYY(fechaStr) {
  if (!fechaStr || typeof fechaStr !== 'string') return null

  const [dia, mes, año] = fechaStr.split('/')
  if (!dia || !mes || !año) return null

  const fecha = new Date(+año, +mes - 1, +dia)
  return isNaN(fecha) ? null : fecha
}

module.exports = { parseFechaDDMMYYYY }
