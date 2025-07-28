export const printTestSheetAction = async (printer: any, body: any) => {
  // body es la mesa
  const data = body.data;

  try {
    printer.println(data);
    // Cortar el papel
    printer.cut();

    // Ejecutar todos los comandos
    printer.execute();

    return 'Hoja de prueba impresa correctamente';
  } catch (error) {
    // Loguear el error y manejarlo de manera adecuada
    console.error('Error al imprimir el ticket:', error);

    // Check if the error is a Printer Error
    if (error.message === 'Printer Error') {
      // Handle Printer Error
      throw new Error('Error al imprimir el ticket: Error en la impresora');
    } else {
      // Handle other errors
      throw new Error('Error al imprimir el ticket');
    }
  }
};
