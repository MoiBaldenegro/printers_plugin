import { ThermalPrinter } from 'node-thermal-printer';
import * as path from 'path';
import { restaurantDetails } from '../../utils/format';
import { formatToCurrency } from 'src/utils/formatToCurrency';

export const printClosedBillsReports = async (
  printer: ThermalPrinter,
  body: any,
) => {
  const na = '--';
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
    printer.println('CUENTAS PAGADAS');
    printer.bold(false);
    printer.println(`Ventas del dia: ${body.period}`);
    // printer.println(`Ventas del dia: ${body.openDate.slice(0, 10) ?? '#####'}`);

    printer.println('');

    printer.alignLeft();
    printer.println(`Usuario: ${body.user}`);
    printer.println(`Fecha ${body.currentTime}`);

    printer.alignCenter();
    await printImage(dividerImgPath);

    printer.newLine();
    /*///////////////////////////////////////////////////////////////////////////
    ///////////////  Restaurante /////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////*/

    printer.alignLeft();
    printer.bold(true);
    printer.println('Tipo de venta: Restaurante');
    printer.bold(false);

    printer.newLine();

    printer.alignCenter();

    printer.underline(true);
    printer.println(`Pago  Cuenta Nota Mesero Cantidad($) Hora`);
    printer.underline(false);

    printer.newLine();

    let count = 0;
    let countTotal = 0;

    body?.restaurantOrders?.forEach((item) => {
      if (item?.payment?.length <= 0 || !item?.payment[0]?.paymentCode) return;
      if (item?.notes?.length <= 0) {
        count++;
        countTotal++;
      }
      const paymentCode = item?.payment[0]?.paymentCode;
      const billCode = item?.code;
      const userCode = item?.userCode ?? '0000';
      const payQuantity = formatToCurrency(
        item?.payment[0]?.paymentTotal,
      ).padStart(12, ' ');
      const hora = new Date(item?.createdAt)
        .toLocaleTimeString('es-ES')
        .slice(0, 5);
      if (item?.notes?.length > 0) {
        const finishedNotes = item?.notes?.filter(
          (note) => note?.status === 'finished',
        );

        finishedNotes?.forEach((note) => {
          if (note?.paymentCode === 'NP') return;
          const payNote = item?.payment?.filter(
            (payment) => payment._id === note?.paymentCode,
          );
          const paymentCodeNote = payNote[0]?.paymentCode;
          const payQuantityNote = formatToCurrency(
            payNote[0]?.paymentTotal,
          ).padStart(12, ' ');
          const horaNote = new Date(note?.createdAt)
            .toLocaleTimeString('es-ES')
            .slice(0, 5);
          count++;
          countTotal++;
          printer.println(
            `${paymentCodeNote} ${billCode} ${note.noteNumber.toString().padEnd(3, ' ')} ${userCode} ${payQuantityNote} ${horaNote}`,
          );
        });
        return;
      }
      printer.println(
        `${paymentCode} ${billCode} ${na.padEnd(3, ' ')} ${userCode} ${payQuantity} ${hora}`,
      );
    });

    // vamos a busvar que pago es de cada nota por la propiedad referenciada en ella filtrando desde el array de pagos que viene de la cuenta princpal

    printer.newLine();

    printer.alignRight();
    printer.bold(true);
    printer.println(
      `${count} Cuentas. $${formatToCurrency(body.restaurantTotal)}`,
    );
    printer.bold(false);

    printer.newLine();

    printer.alignCenter();
    await printImage(dividerImgPath);

    ///////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////
    ///////////////  TOGO /////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    printer.newLine();

    printer.alignLeft();
    printer.bold(true);
    printer.println('Tipo de venta: Para llevar');
    printer.bold(false);

    printer.newLine();

    printer.alignCenter();

    printer.underline(true);
    printer.println(`Pago   Cuenta Usuario    Cantidad($)  Hora`);
    printer.underline(false);

    printer.newLine();

    body?.togoOrders?.forEach((item) => {
      countTotal++;
      const paymentCode = item?.payment[0]?.paymentCode;
      const billCode = item?.code;
      const userCode = item?.userCode ?? '0000';
      const payQuantity = formatToCurrency(
        item?.payment[0]?.paymentTotal,
      ).padStart(15, ' ');
      const hora = new Date(item?.createdAt)
        .toLocaleTimeString('es-ES')
        .slice(0, 5);
      printer.println(
        `${paymentCode} ${billCode} ${userCode}  ${payQuantity} ${hora}`,
      );
    });

    printer.newLine();

    printer.alignRight();
    printer.bold(true);
    printer.println(
      `${body?.togoOrders?.length ?? 0} Cuentas. Total: $${formatToCurrency(body?.togoTotal)}`,
    );
    printer.bold(false);

    printer.newLine();

    printer.alignCenter();
    await printImage(dividerImgPath);

    printer.newLine();

    printer.alignLeft();
    printer.bold(true);
    printer.println('Tipo de venta: Telefónico');
    printer.bold(false);

    printer.newLine();

    printer.alignCenter();

    printer.underline(true);
    printer.println(`Pago   Cuenta Usuario    Cantidad($)  Hora`);
    printer.underline(false);

    printer.newLine();

    body?.phoneOrders?.forEach((item) => {
      countTotal++;
      const paymentCode = item?.payment[0]?.paymentCode;
      const billCode = item?.code;
      const userCode = item?.userCode;
      const payQuantity = formatToCurrency(
        item?.payment[0]?.paymentTotal,
      ).padStart(15, ' ');
      const hora = new Date(item?.createdAt)
        .toLocaleTimeString('es-ES')
        .slice(0, 5);
      printer.println(
        `${paymentCode} ${billCode} ${userCode}  ${payQuantity} ${hora}`,
      );
    });

    printer.newLine();

    printer.alignRight();
    printer.bold(true);
    printer.println(
      `${body?.phoneOrders?.length ?? 0} Cuentas. Total: $${formatToCurrency(body?.phoneTotal)}`,
    );
    printer.bold(false);

    printer.newLine();

    printer.alignCenter();
    await printImage(dividerImgPath);

    printer.newLine();

    printer.alignLeft();
    printer.bold(true);
    printer.println('Tipo de venta: Rappi');
    printer.bold(false);

    printer.newLine();

    printer.alignCenter();

    printer.underline(true);
    printer.println(`Pago   Cuenta Usuario    Cantidad($)  Hora`);
    printer.underline(false);

    printer.newLine();

    body?.rappiOrders?.forEach((item) => {
      countTotal++;
      const paymentCode = item?.payment[0]?.paymentCode;
      const billCode = item?.code;
      const userCode = item?.userCode;
      const payQuantity = formatToCurrency(
        item?.payment[0]?.paymentTotal,
      ).padStart(15, ' ');
      const hora = new Date(item?.createdAt)
        .toLocaleTimeString('es-ES')
        .slice(0, 5);
      printer.println(
        `${paymentCode} ${billCode} ${userCode}  ${payQuantity} ${hora}`,
      );
    });

    printer.newLine();

    printer.alignRight();
    printer.bold(true);
    printer.println(
      `${body?.rappiOrders.length ?? 0} Cuentas. Total: $${formatToCurrency(body?.rappiTotal)}`,
    );
    printer.bold(false);

    printer.newLine();

    printer.alignCenter();
    await printImage(dividerImgPath);

    const total =
      body.restaurantTotal + body.togoTotal + body.phoneTotal + body.rappiTotal;

    printer.newLine();
    printer.alignRight();
    printer.bold(true);
    printer.println(
      `${countTotal} Cuentas. Total: $${formatToCurrency(total)}`,
    );
    printer.bold(false);

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
