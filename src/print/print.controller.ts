import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  NotFoundException,
  Options,
  Res,
  Req,
} from '@nestjs/common';

import { Request, Response } from 'express';
import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
} from 'node-thermal-printer';

import {
  dateOptions,
  formatearCadena,
  headInfoProducts,
  restaurantDetails,
  timeOptions,
  userInformation,
} from './utils/format';

import * as path from 'path';
import { PrintService } from './print.service';

@Controller('print')
export class PrintController {
  constructor(private readonly printService: PrintService) {}
  // Responde a OPTIONS para habilitar CORS
  @Options('billPrint')
  handleOptions(@Req() req: Request, @Res() res: Response) {
    // Establece los encabezados de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    // Responde con código 204 (sin contenido)
    res.status(204).send(); // Usamos 'status' como función, no como número
  }

  @Post('order')
  async printOrder(@Body() data: any): Promise<string> {
    try {
      const printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: `tcp://${data.tcp}`,
        characterSet: CharacterSet.SLOVENIA,
        removeSpecialCharacters: false,
        width: 42,
        options: {
          timeout: 10000,
        },
      });
      printer.println(userInformation);
      printer.println('');
      printer.alignCenter();
      printer.bold(true);

      data.items?.forEach((item) => {
        printer.println(item.productName);
      });

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
        throw new HttpException(
          'Error al imprimir el ticket: Error en la impresora',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        // Handle other errors
        throw new HttpException(
          'Error al imprimir el ticket',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // new-payment-ticket
  @Post('billPrint')
  async printBillTicket(@Body() data: any): Promise<string> {
    try {
      const response = await this.printService.printOnSiteTicket(data);
      return 'Ticket impreso correctamente';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  // new-payment-ticket
  @Post('new-payment-note')
  async printBillTicketNote(@Body() data: any): Promise<string> {
    try {
      const response =
        await this.printService.printNoteTicketOrderService(data);
      return 'Ticket impreso correctamente';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  @Post('new-payment-ticket')
  async printNewPaymentTicketController(@Body() data: any): Promise<string> {
    try {
      const response = await this.printService.printNewTicketOrderService(data);
      return 'Ticket impreso correctamente';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  @Post('shift')
  async gettest(@Body() body: any) {
    try {
      const response = await this.printService.printshift(body);
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  @Post('command')
  async printCommands(@Body() data: any): Promise<string> {
    try {
      const response = await this.printService.printCommands(data);
      return 'Ticket impreso correctamente';
    } catch (error) {
      // Handle other errors
      throw new HttpException(
        'Error al imprimir el ticket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('cashier-session/close')
  async cashierSessionClose(@Body() body: any): Promise<string> {
    try {
      const response = await this.printService.printCloseCashierSesison(body);
      return 'Ticket impreso correctamente';
    } catch (error) {
      console.log(error);
      // Handle other errors
      throw new HttpException(
        'Error al imprimir el ticket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('report/closed-bills')
  async closedBills(@Body() body: any): Promise<string> {
    try {
      const response = await this.printService.closedBillsService(body);
      return 'Ticket impreso correctamente';
    } catch (error) {
      // Handle other errors
      throw new HttpException(
        'Error al imprimir el ticket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('report/open-cashier-session')
  async openCashierSession(@Body() body: any): Promise<string> {
    try {
      const response = await this.printService.openCashierSession(body);
      return 'Ticket impreso correctamente';
    } catch (error) {
      // Handle other errors
      throw new HttpException(
        'Error al imprimir el ticket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('report/new-withdraw')
  async newWithdraw(@Body() body: any): Promise<string> {
    try {
      const response = await this.printService.newWithdrawService(body);
      return 'Ticket impreso correctamente';
    } catch (error) {
      // Handle other errors
      throw new HttpException(
        'Error al imprimir el ticket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('printers-health')
  async printersHealth(@Body() body: any) {
    try {
      await this.printService.printerHealth(body);
      return 'Impresoras sanas';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }
}
