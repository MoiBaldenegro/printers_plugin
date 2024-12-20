import { ThermalPrinter } from 'node-thermal-printer';
import * as path from 'path';
import { restaurantDetails } from '../utils/format';

export const printshiftAction = async (printer: ThermalPrinter, body: any) => {
  const imagePath = path.join(
    process.cwd(),
    'resources/app.asar.unpacked/tassets/footerTicket.png',
  );
  const dividerImgPath = path.join(
    process.cwd(),
    'resources/app.asar.unpacked/tassets/dividerTicket.png',
  );

  const printImage = async (imagePath: string) => {
    try {
      await printer.printImage(imagePath);
    } catch (error) {
      console.error(`Error al imprimir imagen ${imagePath}:`, error);
    }
  };

  try {
    // Inicio de la impresión
    printer.alignCenter();
    printer.println(restaurantDetails[0]);
    printer.println(restaurantDetails[1]);
    printer.println(restaurantDetails[2]);

    printer.println('');

    printer.alignLeft();
    printer.println(`Fecha ${new Date().toISOString()}`);

    printer.alignCenter();
    await printImage(dividerImgPath);

    const now = new Date();

    // Extraer horas y minutos
    const hours = now.getHours(); // Horas en formato 24 horas
    const minutes = now.getMinutes(); // Minutos
    // Formatear para asegurarte de que siempre tenga 2 dígitos
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    printer.println('');

    printer.println(body.username);
    printer.println(formattedTime);

    printer.println('');

    printer.alignCenter();
    await printImage(dividerImgPath);
    await printImage(imagePath);

    printer.cut();
    await printer.execute();

    return {
      message: `Impresión exitosa.`,
    };
  } catch (error) {
    throw new Error('Error al generar o imprimir el reporte: ' + error.message);
  }
};
