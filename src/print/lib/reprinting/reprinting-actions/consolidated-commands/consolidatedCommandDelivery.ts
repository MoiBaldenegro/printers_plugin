import { getIMagePath } from 'src/print/lib/getImage';
import { formatearCadena } from 'src/print/utils/format';

export const printDeliveryConsolidatedCommandsAction = async (
  printer: any,
  productsArray: any,
  user: string | undefined,
  sellType?: string,
) => {
  printer.setTextQuadArea();

  const printImage = async (imagePath: string) => {
    try {
      await printer.printImage(imagePath);
    } catch (error) {
      console.error(`Error al imprimir imagen ${imagePath}:`, error);
    }
  };
  const date = new Date().toLocaleString();
  printer.alignRight();
  printer.println(date);
  printer.newLine();
  printer.bold(true);
  printer.println(
    `${formatearCadena(user ?? 'unknown', 16, '-', 0)} `, //TENBEMOS UNA FUNCION APRA FORMATEAR ESTO
    '',
  );
  printer.newLine();
  printer.bold(false);

  printer.alignCenter();
  await printImage(await getIMagePath('dividerTicket.png'));

  printer.newLine();

  printer.alignLeft();
  printer.setTextQuadArea();

  for (const item of productsArray) {
    await printer.println(
      `${item.quantity.toString().padStart(2, '0')} ${item.productName}`.toUpperCase(),
    );
    if (item?.dishes?.length > 0) {
      for (const dish of item.dishes) {
        await printer.println(` + ${dish.dishesName.toUpperCase()}`);
      }
    }
    if (item?.modifiers?.length > 0) {
      for (const modifier of item.modifiers) {
        await printer.println(` > ${modifier.modifierName.toUpperCase()}`);
      }
    }

    printer.print(formatearCadena('', 24, '.', 0));
    printer.println(' ');
  }

  printer.alignRight();
  printer.newLine();
  printer.bold(true);
  printer.println(`${sellType ?? 'Restaurante'}`, '.');
  printer.newLine();
  printer.setTextNormal();
  printer.bold(false);

  printer.alignCenter();
  await printImage(await getIMagePath('dividerTicket.png'));
  await printImage(await getIMagePath('footerTicket.png'));

  printer.cut();
  printer.execute();
};
