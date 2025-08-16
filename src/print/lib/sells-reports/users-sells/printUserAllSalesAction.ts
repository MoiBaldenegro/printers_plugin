import { ThermalPrinter } from 'node-thermal-printer';
import * as path from 'path';
import { formatearCadena, restaurantDetails } from 'src/print/utils/format';
import { UserSells } from './template';
import { formatToCurrency } from 'src/utils/formatToCurrency';

export const printUserAllSalesAction = async (
  printer: ThermalPrinter,
  registers: UserSells[],
  total: number,
) => {
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
    printer.bold(true);
    printer.println(restaurantDetails[0]);
    printer.println('VENTAS POR USUARIO');
    printer.bold(false);
    // printer.println(
    //   ` ${new Date(?.registerData?.createdAt).toLocaleDateString()}`,
    // );

    printer.println('');

    printer.alignLeft();
    printer.println(new Date().toLocaleString());

    printer.alignCenter();
    await printImage(dividerImgPath);

    printer.newLine();
    registers.forEach((register) => {
      const text = `${register.name.slice(0, 31)} $${formatearCadena(formatToCurrency(register.total), 12, ' ', 0)}`;
      printer.leftRight(`${formatearCadena(text, 45, ' ', 0)}`, ' ');
    });

    const totalText = `${formatearCadena(formatToCurrency(total), 12, ' ', 0)}`;
    printer.bold(true);
    const totalTitle = `${formatearCadena('Total', 33, ' ', 0)}`;
    printer.leftRight(totalTitle, `${totalText}`);
    printer.bold(false);

    printer.newLine();
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
