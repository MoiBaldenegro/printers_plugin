import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
} from 'node-thermal-printer';
import { printOnSiteAction } from './lib/onSiteTicket';
import { printCommandsAction } from './lib/printCommands';
import { printshiftAction } from './lib/printShift';
import { printCloseCashierSessionAction } from './lib/printCloseCashierSessionAction';
import { printClosedBillsReports } from './lib/reports/printClosedBillsReports';
import { printOpenCashierSession } from './lib/reports/printOpenCashierSession';
import { printNewWithdraw } from './lib/reports/printNewWithdraw';
import { printTestSheetAction } from './lib/health/printersTestSheet';
import formatSellType from './lib/formatSellType';

@Injectable()
export class PrintService {
  private async createPrinter(ip: string) {
    return new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `tcp://${ip}`,
      characterSet: CharacterSet.SLOVENIA,
      removeSpecialCharacters: false,
      width: 42,
      options: {
        timeout: 100000,
      },
    });
  }

  // crearemos una funcion para leer  el archiuvo de configuracion

  private async readConfig() {
    const filePath = path.join(process.cwd(), 'devicerc.json');
    try {
      // Leer el archivo JSON
      const data = await fs.readFile(filePath, 'utf-8');
      const config = JSON.parse(data);

      // Extraer la IP del campo tcp en settings.printers[0]
      const tcp = config.settings?.printers[0]?.tcp ?? '';
      if (!tcp) {
        throw new NotFoundException(
          'La clave tcp no se encontró en la configuración.',
        );
      }

      return { config, tcp }; // Retorna tanto el objeto completo como la IP
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(
          'No se encontró el archivo de configuración.',
        );
      }
      throw new Error(
        'Error al leer el archivo de configuración: ' + error.message,
      );
    }
  }

  async getIMagePath(imageName: string) {
    const imagePath = path.join(
      process.cwd(),
      `resources/app.asar.unpacked/tassets/${imageName}}`,
    );
    return imagePath;
  }

  async getTcpIp() {
    const { tcp } = await this.readConfig();
    return tcp; // Método público para obtener solo la IP
  }

  async getTerminalName() {
    const { config } = await this.readConfig();
    return config.deviceName; // Método público para obtener solo la IP
  }

  // ocupo saber la ip

  async printshift(body: any) {
    try {
      const readConfig = await this.getTcpIp();
      const printer = await this.createPrinter(readConfig);
      const response = await printshiftAction(printer, body);
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  async printCloseCashierSesison(body: any) {
    try {
      const readConfig = await this.getTcpIp();
      const terminalName = await this.getTerminalName();
      const printer = await this.createPrinter(readConfig);
      const response = await printCloseCashierSessionAction(
        printer,
        body,
        terminalName,
      );
      return response;
    } catch (error) {
      console.error(error);
      throw new NotFoundException('No se completo la impresion');
    }
  }

  async printOnSiteTicket(body: any) {
    try {
      const { config } = await this.readConfig();
      const readConfig = await this.getTcpIp();
      const printer = await this.createPrinter(readConfig);
      if (!printer) {
        console.warn(`No se pudo crear la impresora para TCP: ${readConfig}`);
        return;
      }
      await printOnSiteAction(printer, body);

      const printerArray = config.printersArray;
      const printerAuth = printerArray.filter((printer_) => {
        return printer_?.printActions?.includes('PRINT_ONSITE_ORDER_TICKET');
      });

      await Promise.allSettled(
        printerAuth.map(async (printer_i) => {
          try {
            const printer = await this.createPrinter(printer_i.tcp);
            if (!printer) {
              console.warn(
                `No se pudo crear la impresora para TCP: ${printer_i.tcp}`,
              );
              return;
            }
            await printOnSiteAction(printer, body);
            console.log(`Impresión exitosa en ${printer_i.printerName}`);
          } catch (error) {
            console.error(
              `Error imprimiendo en impresora ${printer_i.printerName}:`,
              error,
            );
          }
        }),
      );
    } catch (error) {
      console.log('Entre a este error');
      console.log(error);
      throw new NotFoundException(`${error}`);
    }
  }
  async printCommands(body: any) {
    const user = `${body.userCode} ${body.user.split(' ')[0]} ${body.user.split(' ')[1]}`;
    const table = body?.tableNum;
    const sellType = formatSellType(body?.sellType);

    try {
      const { config } = await this.readConfig();
      const printerArray = config.printersArray;

      const commandProducts = body.products.filter(
        (item) => item.active === false,
      );

      await Promise.allSettled(
        printerArray.map(async (item) => {
          const currentPrinter = item;

          const commandProductsFilter = commandProducts.filter((item_product) =>
            currentPrinter?.associatedProducts?.includes(item_product.code),
          );

          if (commandProductsFilter.length <= 0) return;

          try {
            const printer = await this.createPrinter(item.tcp);
            await printCommandsAction(
              printer,
              commandProductsFilter,
              user,
              table,
              sellType,
            );
            console.log(`Impresión exitosa en ${item.printerName}`);
          } catch (error) {
            console.error(`Error imprimiendo en ${item.printerName}:`, error);
          }
        }),
      );

      return {
        message: `Impresión terminada.`,
      };
    } catch (error) {
      throw new NotFoundException('No se completó la impresión');
    }
  }

  async closedBillsService(body: any) {
    try {
      const readConfig = await this.getTcpIp();
      const printer = await this.createPrinter(readConfig);
      const response = await printClosedBillsReports(printer, body);
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  async openCashierSession(body: any) {
    try {
      const readConfig = await this.getTcpIp();
      const printer = await this.createPrinter(readConfig);
      const response = await printOpenCashierSession(printer, body);
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  async newWithdrawService(body: any) {
    try {
      const readConfig = await this.getTcpIp();
      const printer = await this.createPrinter(readConfig);
      const response = await printNewWithdraw(printer, body);
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  async printerHealth(body: any) {
    try {
      const { config } = await this.readConfig();
      const printerArray = config.printersArray;
      await Promise.allSettled(
        printerArray.map(async (printer_i) => {
          try {
            const printer = await this.createPrinter(printer_i.tcp);
            if (!printer) {
              console.warn(
                `No se pudo crear la impresora para TCP: ${printer_i.tcp}`,
              );
              return;
            }
            await printTestSheetAction(printer, body);
          } catch (error) {
            console.error(
              `Error imprimiendo en ${printer_i.printerName}:`,
              error,
            );
          }
        }),
      );
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }
}
