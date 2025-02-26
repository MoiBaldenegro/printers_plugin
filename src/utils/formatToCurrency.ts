export const formatToCurrency = (input) => {
  const numericValue = parseFloat(input);

  // Si no es un número válido, devolver "0.00"
  if (isNaN(numericValue)) {
    return '0.00';
  }

  return numericValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
