import { formatearCadena, restaurantDetails } from 'src/print/utils/format';
import { getIMagePath } from '../../getImage';
import { workerData } from 'worker_threads';

export const printWorkTimeReportAction = async (printer: any, body: any) => {
  const printImage = async (imagePath: string) => {
    try {
      await printer.printImage(imagePath);
    } catch (error) {
      console.error(`Error al imprimir imagen ${imagePath}:`, error);
    }
  };

  printer.alignCenter();
  printer.bold(true);
  printer.println(restaurantDetails[0]);
  printer.println('ASISTENCIA Y HORAS');
  printer.bold(false);
  printer.println(body.period);

  printer.newLine();

  const title_left = 'USR    ';
  const title_rigth = formatearCadena(
    '    EN   SL    RG    FN    TT     TR',
    40,
    ' ',
    0,
  );
  const description_headers =
    'USR = Usuario, EN = Entrada de turno, SL = Salida a receso, RG = Regreso de receso, FN = Fin de turno, TT = Tiempo de trabajo, TR = Tiempo de receso';

  printer.leftRight(title_left, title_rigth);
  await printImage(await getIMagePath('dividerTicket.png'));

  // for off para iterar
  for (const record of body.workData) {
    printer.alignLeft();
    const workedTime =
      record?.workedTime?.tiempoTotal?.replaceAll(' ', '') ?? '--';
    const breakTime =
      record?.workedTime?.tiempoDescanso?.replaceAll(' ', '') ?? '--';
    const line_one = `${formatearCadena(record.firstTime, 5, ' ', 0)}`;
    const line_two = `${formatearCadena(record.secondTime, 5, ' ', 0)}`;
    const line_three = `${formatearCadena(record.thirdTime, 5, ' ', 0)}`;
    const line_four = `${formatearCadena(record.fourthTime, 5, ' ', 0)}`;
    const line_five = `${formatearCadena(workedTime, 6, ' ', 0)}`;
    const line_six = `${formatearCadena(breakTime, 6, ' ', 0)}`;
    const userName = `${record.user.slice(0, 9)}->`;
    const formatLine = `${line_one} ${line_two} ${line_three} ${line_four} ${line_five} ${line_six}`;
    printer.leftRight(userName, formatLine);
  }

  await printImage(await getIMagePath('dividerTicket.png'));

  printer.bold(true);
  printer.println(`Registros totales: ${body.workData?.length || 0}`);
  printer.bold(false);

  printer.println(description_headers);
  printer.alignCenter();
  await printImage(await getIMagePath('dividerTicket.png'));
  await printImage(await getIMagePath('footerTicket.png'));

  printer.cut();
  printer.execute();
};
