export function moneyToLetter(cantidad: string | number): string {
  const unidades: string[] = [
    '',
    'UN',
    'DOS',
    'TRES',
    'CUATRO',
    'CINCO',
    'SEIS',
    'SIETE',
    'OCHO',
    'NUEVE',
  ];
  const especiales: string[] = [
    'ONCE',
    'DOCE',
    'TRECE',
    'CATORCE',
    'QUINCE',
    'DIECISEIS',
    'DIECISIETE',
    'DIECIOCHO',
    'DIECINUEVE',
  ];
  const decenas: string[] = [
    '',
    'DIEZ',
    'VEINTE',
    'TREINTA',
    'CUARENTA',
    'CINCUENTA',
    'SESENTA',
    'SETENTA',
    'OCHENTA',
    'NOVENTA',
  ];
  const centenas: string[] = [
    '',
    'CIENTO',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS',
  ];

  function decenasYUnidades(num: number): string {
    if (num < 10) return unidades[num];
    if (num > 10 && num < 20) return especiales[num - 11];
    if (num % 10 === 0) return decenas[Math.floor(num / 10)];
    if (num < 30) return 'VEINTI' + unidades[num % 10].toLowerCase();
    return decenas[Math.floor(num / 10)] + ' Y ' + unidades[num % 10];
  }

  function centenasYDecenas(num: number): string {
    if (num === 100) return 'CIEN';
    if (num > 100) {
      return (
        centenas[Math.floor(num / 100)] + ' ' + decenasYUnidades(num % 100)
      );
    }
    return decenasYUnidades(num);
  }

  function miles(num: number): string {
    if (num < 1000) return centenasYDecenas(num);
    if (num < 2000) return 'MIL ' + centenasYDecenas(num % 1000);
    return (
      centenasYDecenas(Math.floor(num / 1000)) +
      ' MIL ' +
      centenasYDecenas(num % 1000)
    );
  }

  function millones(num: number): string {
    if (num < 1000000) return miles(num);
    if (num < 2000000) return 'UN MILLON ' + miles(num % 1000000);
    return (
      miles(Math.floor(num / 1000000)) + ' MILLONES ' + miles(num % 1000000)
    );
  }

  let numero: number;

  if (typeof cantidad === 'string') {
    const limpio = cantidad.replace(/,/g, '').trim();
    numero = Number(limpio);
  } else {
    numero = cantidad;
  }

  if (isNaN(numero)) {
    throw new Error('Cantidad inválida');
  }

  const entero: number = Math.floor(numero);
  const decimales: number = Math.round((numero - entero) * 100);

  let letras: string = millones(entero).trim();

  letras = letras.replace(/\s+/g, ' ');
  if (letras === '') letras = 'CERO';

  const centavosStr: string = decimales.toString().padStart(2, '0');

  return `${letras} PESO${entero === 1 ? '' : 'S'} ${centavosStr}/100 M.N.`;
}
