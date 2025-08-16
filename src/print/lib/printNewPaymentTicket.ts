import { formatToCurrency } from 'src/utils/formatToCurrency';
import { formatearCadena, restaurantDetails } from '../utils/format';
import { getIMagePath } from './getImage';
import { moneyToLetter } from 'src/utils/moneyToLetter';
import { calculateBillTotal } from '../utils/calculateTotals';
import { setRevolveAction } from './transactionsResume';
import formatSellType from './formatSellType';
import { formatPaymentType, PaymentType } from './formatPaymentType';
import { calculateTips } from './calculateTips';

export const printNewPaymentTicketAction = async (printer: any, body: any) => {
  const order = body.accountId;
  const payment = body;
  const transactions = payment?.transactions;
  console.log('ESATAS SON LAS TRANSACCIONES');
  console.log(transactions);
  const completeLine = (number: number) => {
    const str = ''.padEnd(number, ' ');
    return printer.print(str);
  };
  const sellType =
    body?.sellType === 'RAPPI_ORDER'
      ? 'RAPPI'
      : body?.sellType === 'PHONE_ORDER'
        ? 'PHONE'
        : body?.sellType === 'TOGO_ORDER'
          ? 'TOGO'
          : 'ON_SITE';
  const dishesIndex = order?.sellType === 'RAPPI_ORDER' ? 3 : 0;

  const date = new Date().toLocaleString('MX-mx');
  const products = order?.products;
  const userName = `${order?.user}`;
  const billCode = order?.code;
  const checkTotal = calculateBillTotal(
    order.products,
    order.discount,
    sellType,
  );

  if (!Array.isArray(products) || products.length === 0) {
    console.warn('No hay productos para imprimir en el ticket');
    return 'No hay productos para imprimir';
  }

  try {
    // Función para imprimir una imagen y manejar errores
    const printImage = async (imagePath: string) => {
      try {
        await printer.printImage(imagePath);
      } catch (error) {
        console.error(`Error al imprimir imagen ${imagePath}:`, error);
      }
    };

    // Inicio de la impresión
    printer.alignCenter();
    await printImage(await getIMagePath('TomateTaqueria.png'));
    printer.println('');

    printer.alignLeft();
    printer.println(restaurantDetails[0]);
    printer.println(restaurantDetails[1]);
    printer.println(restaurantDetails[2]);
    printer.println(restaurantDetails[3]);

    printer.println(`Fecha ${date}`);
    printer.println(`Usuario: ${userName}`);

    printer.newLine();

    printer.alignCenter();
    printer.print(
      `${sellType === 'RAPPI' ? 'RAPPI' : sellType === 'PHONE' ? 'TELEFONICO' : sellType === 'TOGO' ? 'PARA LLEVAR' : 'RESTAURANTE'}`.padEnd(
        42,
        ' ',
      ),
    );
    completeLine(6);

    printer.bold(true);
    printer.print(`Cuenta:${billCode}`.padEnd(41, ' '));
    if (body?.noteNumber) {
      printer.print(`Nota: ${body?.noteNumber}`);
    } else {
      completeLine(7);
    }
    printer.bold(false);

    printer.newLine();

    printer.setTextNormal();

    printer.println('');

    printer.print('Can');
    printer.print(' ');
    printer.print(formatearCadena('Producto', 23, ' ', 0));
    printer.print(' ');
    printer.print(`${formatearCadena('Precio', 10, ' ', 0)}`);
    printer.print(`${formatearCadena('Importe', 10, ' ', 0)}`);

    printer.newLine();
    const productsArray = order.products;
    await printImage(await getIMagePath('dividerTicket.png'));
    for (const item of productsArray) {
      const { prices } = item;
      const selectedPriceIndex =
        prices.findIndex((price) => price.name === sellType) ?? 0;
      if (
        !item.prices ||
        !Array.isArray(item.prices) ||
        item.prices.length === 0
      ) {
        console.warn(`Producto ${item.productName} no tiene precios definidos`);
        return;
      }
      const productFormat = formatearCadena(item.productName, 24, ' ', 0);
      const quantityFormat = formatearCadena(
        item.quantity.toString(),
        2,
        '0',
        1,
      );
      const totalPrice = item.quantity * item.prices[selectedPriceIndex].price;

      printer.print(quantityFormat);
      printer.print(' ');
      printer.print(productFormat);
      printer.print(' ');
      printer.print(
        `$${formatearCadena(formatToCurrency(item.prices[selectedPriceIndex].price), 8, ' ', 0)}`,
      );
      printer.print(' ');
      printer.print(
        `$${formatearCadena(formatToCurrency(totalPrice), 9, ' ', 0)}`,
      );

      if (item?.discount) {
        console.log(item.discount);
        await printer.print(
          `${formatearCadena(`Descuento especial:     -$${formatToCurrency(item.discount.discountedAmount)}`, 42, ' ', 0)}`,
        );
      }

      if (item?.dishes?.length > 0) {
        for (const dish of item.dishes) {
          await printer.print(
            formatearCadena(
              ` + Comp: ${dish.dishesName.toUpperCase()}`,
              27,
              ' ',
              0,
            ),
          );
          await printer.print(
            ` $${formatearCadena(dish.prices[dishesIndex].price.toFixed(2).toString(), 8, ' ', 0)}`,
          );
          await printer.print(
            ` $${formatearCadena((dish.prices[dishesIndex].price.toFixed(2) * item.quantity).toFixed(2).toString(), 9, ' ', 0)}`,
          );
        }
      }

      // if (item?.modifiers?.length > 0) {
      //   for (const modifier of item.modifiers) {
      //     await printer.print(
      //       formatearCadena(
      //         ` > ${modifier.modifierName.toUpperCase()}`,
      //         42,
      //         ' ',
      //         0,
      //       ),
      //     );
      //     await printer.print(formatearCadena('', 6, ' ', 0));
      //   }
      // }
    }

    printer.newLine();
    await printImage(await getIMagePath('dividerTicket.png'));

    printer.alignLeft();
    printer.bold(true);
    printer.println(
      `${order.products.reduce((acc, product) => acc + product.quantity, 0)} productos.`,
    );
    printer.bold(false);

    printer.println('');

    // Logica de propina

    // printer.alignCenter();
    printer.leftRight('Subtotal', `$${formatToCurrency(checkTotal)}`);
    if (order?.discount) {
      printer.leftRight('Descuento', '10% -$0,000.00');
    }
    printer.leftRight('IVA', '   $0.00');

    printer.newLine();
    printer.newLine();

    // printer.println('');
    // printer.bold(true);
    // printer.leftRight('Total pagado', `$${formatToCurrency(checkTotal)}`);
    // printer.bold(false);
    // printer.setTextNormal();
    // printer.print(moneyToLetter(checkTotal));
    // printer.newLine();
    // printer.newLine();

    ///////////////////////////////

    const transacs = setRevolveAction(transactions);
    let revolve = 0;
    const tips = calculateTips(transactions);

    for (const [paymentType, data] of Object.entries(transacs)) {
      if (data.totalQuantity <= 0) continue;
      if (paymentType === PaymentType.CASH) {
        if (data.totalQuantity > data.totalPayQuantity) {
          revolve = data.totalQuantity - data.totalPayQuantity;
        }
        await printer.leftRight(
          `${formatPaymentType(paymentType as PaymentType)}:      Recibido: $${formatToCurrency(data.totalQuantity)}`,
          ` $${formatToCurrency(data.totalPayQuantity)}`,
        );
        continue;
      }
      await printer.leftRight(
        `${formatPaymentType(paymentType as PaymentType)}:`,
        ` $${formatToCurrency(data.totalPayQuantity)}`,
      );
    }

    printer.newLine();

    printer.underline(true);
    printer.println(`Propina: $${formatToCurrency(tips)}`);
    printer.underline(false);

    printer.println('');
    printer.bold(true);
    printer.leftRight('Total pagado', `$${formatToCurrency(checkTotal)}`);
    printer.bold(false);
    printer.setTextNormal();
    printer.print(moneyToLetter(checkTotal));
    printer.newLine();
    printer.newLine();

    if (revolve > 0) {
      printer.bold(true);
      printer.println(`Cambio: $${formatToCurrency(revolve)}`);
      printer.bold(false);
    }
    // if (!transactions || transactions.length === 0) {
    //   printer.println('No hay transacciones registradas');
    // } else {
    //   for (const transaction of transactions) {
    //     await printer.println(
    //       `Pago: ${transaction.paymentType}   $${formatToCurrency(transaction.payQuantity)}`,
    //     );
    //   }
    // }

    // const tips = transactions?.reduce(
    //   (acc, item) => acc + parseFloat(item.tips),
    //   0,
    // );

    // if (tips && tips > 0) {
    //   printer.println(`Propina: ${tips}`);
    // }

    /////////////////////////

    printer.newLine();
    printer.newLine();

    // printer.alignLeft();
    // printer.bold(true);
    // printer.underline(true);
    // printer.println('Propina no incluida');
    // printer.underline(false);
    // printer.bold(false);

    //////////////////////////////////////////////
    /*ACA TODA LA LOGICA DE LOS TICKETS PAGADOS */
    //////////////////////////////////////////////

    printer.alignCenter();

    printer.newLine();
    // printer.alignCenter();
    await printImage(await getIMagePath('payment.png'));
    printer.newLine();

    printer.setTextNormal();

    printer.println(
      'Si requiere factura favor de indicarle al mesero o solicitarla por whatsapp: 333-446-5374',
    );

    /////////////////////////////////////////////
    ////////////////////////////////////////////////

    printer.alignCenter();
    await printImage(await getIMagePath('dividerTicket.png'));

    printer.alignCenter();
    await printImage(await getIMagePath('footerTicket.png'));

    // Cortar el papel
    printer.cut();

    // Ejecutar todos los comandos
    printer.execute();

    return 'Ticket impreso correctamente';
  } catch (error) {
    console.log(error);
    // Loguear el error y manejarlo de manera adecuada
    if (error.message === 'Printer Error') {
      throw new Error('Error al imprimir el ticket: Error en la impresora');
    } else {
      throw new Error('Error al imprimir el ticket');
    }
  }
};
