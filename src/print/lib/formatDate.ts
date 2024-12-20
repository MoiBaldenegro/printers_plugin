export function formatDate(fecha) {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short', // Formato de fecha corta
    timeStyle: 'short', // Formato de hora corta (24h)
    hour12: false, // Desactiva el formato de 12 horas
  })
    .format(fecha)
    .slice(10, 16); // Truncar el string a 16 caracteres
}
