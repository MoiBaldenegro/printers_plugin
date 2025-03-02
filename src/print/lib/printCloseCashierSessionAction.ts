/* eslint-disable prettier/prettier */
import { ThermalPrinter } from 'node-thermal-printer';
import * as path from 'path';
import { restaurantDetails } from '../utils/format';
import { formatToCurrency } from 'src/utils/formatToCurrency';

export const printCloseCashierSessionAction = async (
  printer: ThermalPrinter,
  body: any,
  terminalName,
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
  const replacementText = '000,000,000,00';

  try {
    // Inicio de la impresión
    printer.alignCenter();
    printer.println(restaurantDetails[0]);
    printer.bold(true);
    printer.println('CIERRE DE CAJA');
    printer.bold(false);
    printer.println(`Ventas del dia: ${body.openDate.slice(10) ?? "aca"}`);

    printer.newLine();

    printer.alignLeft();
    printer.println(`Usuario: ${body.userName ?? replacementText}`);
    printer.println(`Fecha ${body.date ?? replacementText}`);

    printer.newLine();

    printer.alignCenter();
    await printImage(dividerImgPath);

    printer.newLine();

    printer.alignLeft();
    printer.bold(true);
    printer.println(`Folio: ${body.folio.toUpperCase() ?? replacementText}`);
    printer.println(`Terminal: ${terminalName ?? replacementText} `);
    printer.println(`Cajero: ${body.userName ?? "aca"}`);
    printer.println(`Apertura: ${body.openDate ?? "aca"}`);
    printer.println(`Cierre: ${body.closeDate ?? "aca"}`);
    printer.bold(false);

    printer.newLine();

    printer.underline(true);
    printer.print('Conteo de caja');
    printer.underline(false);

    printer.newLine();

    printer.leftRight(
      'Efectivo',
      `$${formatToCurrency(body?.sessionCount?.cash) ?? replacementText}`,
    );
    printer.leftRight(
      'Tarjetas',
      `$${formatToCurrency(body?.sessionCount?.targets) ?? replacementText}`,
    );
    printer.leftRight(
      'Transferencia',
      `$${formatToCurrency(body?.sessionCount?.transfer) ?? replacementText}`,
    );

    printer.newLine();

    printer.bold(true);
    printer.leftRight(
      'Total',
      `$${formatToCurrency(body?.sessionCount?.total) ?? replacementText}`,
    );
    printer.bold(false);

    printer.newLine();

    printer.underline(true);
    printer.print('Ventas del dia');
    printer.underline(false);

    printer.newLine();

    printer.leftRight(
      'Efectivo',
      `   $${formatToCurrency(body?.sellsCount?.cash) ?? replacementText}`,
    );
    printer.leftRight(
      'Tarjeta de débito',
      `   $${formatToCurrency(body?.sellsCount?.targets) ?? replacementText}`,
    );
  
    printer.leftRight(
      'Transferencia',
      `   $${formatToCurrency(body?.sellsCount?.transferences) ?? replacementText}`,
    );
   

    printer.newLine();

    printer.bold(true);
    printer.leftRight(
      'Total',
      `   $${formatToCurrency(body?.sellsCount?.total) ?? replacementText}`,
    );
    printer.bold(false);

    printer.newLine();

    printer.underline(true);
    printer.print('Resumen');
    printer.underline(false);

    printer.newLine();

    printer.leftRight(
      'Efectivo',
      `${parseFloat(body?.summary?.cash) > 0 ? '-' : parseFloat(body?.summary?.cash) < 0  ? "+": ''} $${(parseFloat(body?.summary?.cash) < 0 ? formatToCurrency(body?.summary?.cash * -1) : formatToCurrency(body?.summary?.cash)) ?? replacementText}`,
    );
    printer.leftRight(
      'Tarjetas',
      `${parseFloat(body?.summary?.targets) > 0 ? '-' : parseFloat(body?.summary?.targets) < 0 ? '+' : ''} $${ parseFloat(body?.summary?.targets) < 0 ? formatToCurrency(body?.summary?.targets * -1):(formatToCurrency(body?.summary?.targets)) ?? replacementText}`,
    );
 
    printer.leftRight(
      'Transferencia',
      `${parseFloat(body?.summary?.transferences) > 0 ? '-' : parseFloat(body?.summary?.transferences) < 0 ? '+' :''} $${(parseFloat(body?.summary?.transferences) < 0 ? formatToCurrency(body?.summary?.transferences * -1) :formatToCurrency(body?.summary?.transferences)) ?? replacementText}`,
    );
   
    printer.newLine();

    // aca si va ir el summary total
    printer.bold(true);
    printer.leftRight(
      'Total',
      `${parseFloat(body?.summary?.total) > 0 ? '-' : parseFloat(body?.summary?.total) < 0 ? '+' : ''} $${(parseFloat(body?.summary?.total) < 0 ? formatToCurrency(body?.summary?.total  * -1) :  formatToCurrency(body?.summary?.total)) ?? replacementText}`,
    );
    printer.bold(true);

    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();
    printer.newLine();

    printer.leftRight('_______________________ ', ' _______________________');
    printer.leftRight('  Firma del supervisor', `       Firma del cajero`);
    printer.newLine();

    printer.newLine();
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
