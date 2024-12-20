import {
  formatearCadena,
  headInfoProducts,
  productInfo,
  restaurantDetails,
  userInformation,
} from '../utils/format';
import { getIMagePath } from './getImage';

export const printOnSiteAction = async (printer: any, body: any) => {
  // body es la mesa
  const date = new Date().toDateString();
  const products = body?.bill[0]?.products;
  console.log(body.bill[0]);

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
    printer.println(userInformation);

    printer.println('');

    printer.alignCenter();
    printer.leftRight('Restaurante', '');

    printer.alignCenter();
    printer.bold(true);
    printer.leftRight('Cuenta:000', 'Nota:00');
    printer.bold(false);

    printer.setTextNormal();

    printer.println('');

    printer.println(headInfoProducts);
    printer.alignCenter();
    await printImage(await getIMagePath('dividerTicket.png'));

    products.forEach((item) => {
      const productFormat = formatearCadena(item.productName, 21, ' ', 0);
      const quantityFormat = formatearCadena(
        item.quantity.toString(),
        2,
        '0',
        1,
      );

      const totalPrice = item.quantity * item.prices[0].price;

      const totalPriceFormat = formatearCadena(totalPrice, 8, ' ', 0);

      const individualPrice = formatearCadena(item.prices[0].price, 8, ' ', 0);

      printer.println(
        `${quantityFormat} ${productFormat}$${individualPrice}$${totalPriceFormat}`,
      );
    });

    printer.alignCenter();
    await printImage(await getIMagePath('dividerTicket.png'));

    printer.println('');

    printer.alignLeft();
    printer.println('11 Productos');

    printer.println('');

    printer.alignCenter();
    printer.leftRight('Subtotal', '$0,000.00');
    printer.leftRight('Subtotal', '10% -$0,000.00');
    printer.leftRight('Subtotal', '10% -$0,000.00');
    printer.leftRight('Subtotal', '10% -$0,000.00');

    printer.println('');
    printer.bold(true);
    printer.leftRight('Total por pagar', '$0,000.00');
    printer.bold(false);
    printer.setTextNormal();
    printer.alignRight();
    printer.println('(cantidad en texto/mxn)');

    printer.println('');

    printer.alignCenter();
    printer.leftRight('Dolar', '$00.00');

    printer.println('');

    printer.alignLeft();
    printer.println('Propina no incluida');

    printer.println('');

    printer.println(
      'Si requiere factura favor de indicarle al mesero o solicitarla por whatsapp: 333-446-5374',
    );

    printer.println('');

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
