import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
  printer,
} from 'node-thermal-printer';
import { printOnSiteAction } from './lib/onSiteTicket';
import { printCommandsAction } from './lib/printCommands';
import { printshiftAction } from './lib/printShift';
import { printCloseCashierSessionAction } from './lib/printCloseCashierSessionAction';

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
      throw new NotFoundException('No se completo la impresion');
    }
  }

  async printOnSiteTicket(body: any) {
    try {
      const { config } = await this.readConfig();
      const printerArray = config.printersArray;
      const printerAuth = printerArray.filter((printer_) => {
        return printer_?.printActions?.includes('PRINT_ONSITE_ORDER_TICKET');
      });

      await Promise.all(
        printerAuth.map(async (printer_i) => {
          const printer = await this.createPrinter(printer_i.tcp);
          await printOnSiteAction(printer, body);
        }),
      );

      return {
        message: `Impresión exitosa.`,
      };
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  async printCommands(body: any) {
    try {
      const { config } = await this.readConfig();
      const printerArray = config.printersArray;

      const commandProducts = body.products.filter(
        (item) => item.active === false,
      );

      printerArray?.forEach(async (item) => {
        const currentPrinter = item;

        const commandProductsFilter = commandProducts.filter((item_product) =>
          currentPrinter?.associatedProducts?.includes(item_product.code),
        );
        try {
          if (commandProductsFilter.length <= 0) return;
          const printer = await this.createPrinter(item.tcp);
          await printCommandsAction(printer, commandProductsFilter);
          return { message: `Impresión exitosa.` };
        } catch (error) {
          return { message: `Error impresion` };
        }
      });

      return {
        message: `Impresión exitosa.`,
      };
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }
}
