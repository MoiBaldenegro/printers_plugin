import { ThermalPrinter } from 'node-thermal-printer';
import * as path from 'path';
import { restaurantDetails } from '../utils/format';
import { calculateTempo } from './calculateTimes';

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
    printer.println(
      ` ${new Date(body?.registerData?.createdAt).toLocaleDateString()}`,
    );

    printer.println('');

    printer.alignLeft();
    printer.println(new Date().toLocaleString());

    printer.alignCenter();
    await printImage(dividerImgPath);

    printer.newLine();

    printer.underline(true);
    printer.println(body.username);
    printer.underline(false);
    printer.newLine();

    if (body?.registerData?.firstTime) {
      printer.leftRight(
        `Inicio de turno:`,
        `${body.registerData.firstTime.slice(0, 8)}`,
      );
    }
    if (body?.registerData?.secondTime) {
      printer.leftRight(
        `Salida:`,
        `${body.registerData.secondTime.slice(0, 8)}`,
      );
    }
    if (body?.registerData?.thirdTime) {
      printer.leftRight(
        `Regreso:`,
        `${body.registerData.thirdTime.slice(0, 8)}`,
      );
    }
    if (body?.registerData?.fourthTime) {
      const { firstTime, secondTime, thirdTime, fourthTime, createdAt } =
        body.registerData;
      const tempo = calculateTempo({
        firstTime,
        secondTime,
        thirdTime,
        fourthTime,
        createdAt,
      });

      printer.leftRight(
        `Fin de turno:`,
        `${body.registerData.fourthTime.slice(0, 8)}`,
      );

      if (tempo !== '--') {
        printer.leftRight('Tiempo trabajado:', `${tempo.tiempoTotal}`);
        printer.leftRight('Tiempo de receso:', `${tempo.tiempoDescanso}`);
      }
    }

    printer.newLine();

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
