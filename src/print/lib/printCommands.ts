import { formatDate } from './formatDate';
import { getIMagePath } from './getImage';

export const printCommandsAction = async (printer: any, productsArray: any) => {
  printer.setTextQuadArea();

  // Función para imprimir una imagen y manejar errores
  const printImage = async (imagePath: string) => {
    try {
      await printer.printImage(imagePath);
    } catch (error) {
      console.error(`Error al imprimir imagen ${imagePath}:`, error);
    }
  };
  const date = formatDate(new Date());
  printer.alignRight();
  printer.println(date);
  printer.newLine();
  printer.bold(true);
  printer.println('#### Moises B.  Mesa ##');
  printer.newLine();
  printer.bold(false);

  printer.alignCenter();
  await printImage(await getIMagePath('dividerTicket.png'));

  printer.newLine();

  printer.alignLeft();
  printer.setTextQuadArea();
  productsArray.forEach((item) => {
    printer.println(
      `${item.quantity.toString().padStart(2, '0')} ${item.productName}`.toUpperCase(),
    );
  });

  printer.alignRight();
  printer.newLine();
  printer.bold(true);
  printer.println('RESTAURANTE');
  printer.newLine();
  printer.setTextNormal();
  printer.bold(false);

  printer.alignCenter();
  await printImage(await getIMagePath('dividerTicket.png'));
  await printImage(await getIMagePath('footerTicket.png'));

  printer.cut();
  printer.execute();
};
