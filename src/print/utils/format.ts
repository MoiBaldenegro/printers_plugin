export const headInfoProducts = 'Can Producto             Precio    Importe';
export const productInfo = '000 Product Name     $0,000.00   $0,000.00';

export const restaurantDetails = [
  'TOMATE TAQUERIA SA DE CV',
  'Av.Chapultepec 361-A',
  'Col.Americana, Guadalajara, Jalisco.',
  'Whatsapp: 333-446-5374   RFC: TTA200827EW2',
];

export const userInformation = `Usuario: 1016 Moises Baldenegro`;

export function formatearCadena(cadena, longitudDeseada, character, indicator) {
  // Convertir cadena a string si no es una cadena
  cadena = cadena.toString();

  if (indicator === 0) {
    // Rellenar con el carácter al final
    return cadena.length > longitudDeseada
      ? cadena.slice(0, longitudDeseada)
      : cadena.padEnd(longitudDeseada, character);
  }

  if (indicator === 1) {
    // Rellenar con el carácter al comienzo
    return cadena.length > longitudDeseada
      ? cadena.slice(0, longitudDeseada)
      : character.repeat(longitudDeseada - cadena.length) + cadena;
  }
}

export const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
export const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};
