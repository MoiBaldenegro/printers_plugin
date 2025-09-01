import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ReprintService } from './reprint.service';
import { PrintActions } from 'src/types/auths.types';

@Controller('reprint')
export class ReprintController {
  constructor(private readonly rePrintService: ReprintService) {}

  // este se usa por pagar
  @Post('togo')
  async printTogoLocalAndReprint(@Body() data: any): Promise<string> {
    try {
      await this.rePrintService.reprintforPaymentTicketAction(
        data,
        PrintActions.REPRINT_FOR_PAY_ORDER_TOGO,
      );
      return 'Ticket impreso correctamente';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }
  @Post('rappi')
  async printRappiLocalAndReprint(@Body() data: any): Promise<string> {
    try {
      await this.rePrintService.reprintforPaymentTicketAction(
        data,
        PrintActions.REPRINT_FOR_PAY_ORDER_RAPPI,
      );
      return 'Ticket impreso correctamente';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }
  @Post('phone')
  async printPhoneLocalAndReprint(@Body() data: any): Promise<string> {
    try {
      await this.rePrintService.reprintforPaymentTicketAction(
        data,
        PrintActions.REPRINT_FOR_PAY_ORDER_PHONE,
      );
      return 'Ticket impreso correctamente';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  // este se usa por pagar
  @Post('payed/togo')
  async printTogoPayedTicketLocalAndReprint(
    @Body() data: any,
  ): Promise<string> {
    try {
      await this.rePrintService.reprintpayedTicketAction(
        data,
        PrintActions.REPRINT_TOGO_ORDER_TICKET,
      );
      return 'Ticket impreso correctamente';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  @Post('payed/rappi')
  async printRappiPayedTicketLocalAndReprint(
    @Body() data: any,
  ): Promise<string> {
    try {
      await this.rePrintService.reprintpayedTicketAction(
        data,
        PrintActions.REPRINT_RAPPI_ORDER_TICKET,
      );
      return 'Ticket impreso correctamente';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  @Post('payed/phone')
  async printPhonePayedTicketLocalAndReprint(
    @Body() data: any,
  ): Promise<string> {
    try {
      await this.rePrintService.reprintpayedTicketAction(
        data,
        PrintActions.REPRINT_PHONE_ORDER_TICKET,
      );
      return 'Ticket impreso correctamente';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  @Post('consolidated/delivery/togo')
  async printConsolidatedCommand(@Body() data: any) {
    try {
      await this.rePrintService.reprintpayedTicketAction(
        data,
        PrintActions.CONSOLIDATED_COMMAND_TOGO,
      );
      return 'Ticket impreso correctamente';
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }
}
