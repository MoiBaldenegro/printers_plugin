export function calculateTempo(obj: any) {
  const { firstTime, secondTime, thirdTime, fourthTime, createdAt } = obj;

  // Extraer la fecha base de `createdAt`
  const fechaBase = new Date(createdAt).toISOString().split('T')[0]; // "YYYY-MM-DD"

  // Función auxiliar para construir Date con la fecha base
  const construirFecha = (horaString: string | null): Date | null =>
    horaString ? new Date(`${fechaBase} ${horaString}`) : null;

  // Convertir tiempos a objetos Date
  const inicio = construirFecha(firstTime);
  const descansoInicio = construirFecha(secondTime);
  const descansoFin = construirFecha(thirdTime);
  const fin = construirFecha(fourthTime);

  // Validar que las horas sean suficientes para calcular
  if (!inicio || !fin) {
    return '--';
  }

  let tiempoTotal = fin.getTime() - inicio.getTime();
  let tiempoDescanso = 0;

  // Si hay tiempos de descanso, restarlos del tiempo total
  if (descansoInicio && descansoFin) {
    tiempoDescanso = descansoFin.getTime() - descansoInicio.getTime();
    tiempoTotal -= tiempoDescanso;
  }

  return {
    tiempoTotal: convertirMilisegundosAHorasMinutos(tiempoTotal),
    tiempoDescanso: convertirMilisegundosAHorasMinutos(tiempoDescanso),
  };
}

// Función auxiliar para convertir milisegundos a horas y minutos legibles
function convertirMilisegundosAHorasMinutos(ms: number): string {
  if (ms <= 0) return '0h 0m';
  const horas = Math.floor(ms / (1000 * 60 * 60));
  const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${horas} horas, ${minutos} minutos`;
}
