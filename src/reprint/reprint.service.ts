import { Injectable, NotFoundException } from '@nestjs/common';
import { printOnSiteAction } from 'src/print/lib/onSiteTicket';
import { printDeliveryPaymentTicketAction } from 'src/print/lib/printDeliveryPaymentTicket';
import { rePrintPaymentTicketAction } from 'src/print/lib/reprinting/reprinting-actions/reprintTicketTogo';
import { PrintService } from 'src/print/print.service';
import { PrintActions } from 'src/types/auths.types';

@Injectable()
export class ReprintService {
  constructor(private printService: PrintService) {}

  private async getPrinter() {
    const readConfig = await this.printService.getTcpIp();
    const printer = await this.printService.createPrinter(readConfig);
    return printer;
  }

  async reprintforPaymentTicketAction(body: any, actionKey: PrintActions) {
    try {
      const { config } = await this.printService.readConfig();
      const printer = await this.getPrinter();
      if (!printer) {
        console.warn(`No se pudo crear la impresora para TCP`);
        return;
      }
      await printOnSiteAction(printer, body);
      const printerArray = config.printersArray;
      const printerAuth = printerArray.filter((printer_) => {
        return printer_?.printActions?.includes(actionKey);
      });

      await Promise.allSettled(
        printerAuth.map(async (printer_i) => {
          try {
            const printer = await this.printService.createPrinter(
              printer_i.tcp,
            );
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

  async reprintpayedTicketAction(body: any, actionKey: PrintActions) {
    try {
      const { config } = await this.printService.readConfig();
      const printer = await this.getPrinter();
      if (!printer) {
        console.warn(`No se pudo crear la impresora para TCP`);
        return;
      }
      await printDeliveryPaymentTicketAction(printer, body);
      const printerArray = config.printersArray;
      const printerAuth = printerArray.filter((printer_) => {
        return printer_?.printActions?.includes(actionKey);
      });

      await Promise.allSettled(
        printerAuth.map(async (printer_i) => {
          try {
            const printer = await this.printService.createPrinter(
              printer_i.tcp,
            );
            if (!printer) {
              console.warn(
                `No se pudo crear la impresora para TCP: ${printer_i.tcp}`,
              );
              return;
            }
            await rePrintPaymentTicketAction(printer, body);
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

  async printConsolidatedCommand(body: any, actionKey: PrintActions) {
    try {
      const { config } = await this.printService.readConfig();
      // const printer = await this.getPrinter();
      // if (!printer) {
      //   console.warn(`No se pudo crear la impresora para TCP`);
      //   return;
      // }
      // await printDeliveryPaymentTicketAction(printer, body);
      const printerArray = config.printersArray;
      const printerAuth = printerArray.filter((printer_) => {
        return printer_?.printActions?.includes(actionKey);
      });

      await Promise.allSettled(
        printerAuth.map(async (printer_i) => {
          try {
            const printer = await this.printService.createPrinter(
              printer_i.tcp,
            );
            if (!printer) {
              console.warn(
                `No se pudo crear la impresora para TCP: ${printer_i.tcp}`,
              );
              return;
            }
            await rePrintPaymentTicketAction(printer, body);
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
}
