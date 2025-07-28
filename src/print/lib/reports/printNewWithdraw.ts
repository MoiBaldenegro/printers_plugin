import { ThermalPrinter } from 'node-thermal-printer';
import * as path from 'path';
import { restaurantDetails } from '../../utils/format';
import { formatDate } from '../formatDate';
import { formatToCurrency } from 'src/utils/formatToCurrency';

interface NewWithdrawBody {
  cashierName: string;
  openAmount: number;
}

export const printNewWithdraw = async (printer: ThermalPrinter, body: any) => {
  const date = new Date().toLocaleString('es-ES');
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
    printer.alignCenter();
    printer.println(restaurantDetails[0]);
    printer.bold(true);
    printer.println('RETIRO DE EFECTIVO');
    printer.bold(false);

    printer.println('');

    printer.alignLeft();
    printer.println(`Fecha ${date}`);

    printer.alignCenter();
    await printImage(dividerImgPath);

    printer.newLine();
    ///////////////////////////////////////////////////

    printer.println(`Cajero: ${body.cashierName}`);
    printer.bold(true);
    printer.println(`Monto: $${formatToCurrency(body.openAmount)}`);
    printer.bold(false);
    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();

    printer.leftRight('_______________________ ', ' _______________________');
    printer.leftRight('Firma del supervisor', `     Firma del cajero`);
    printer.newLine();
    ////////////////////////////////////////////////////
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
