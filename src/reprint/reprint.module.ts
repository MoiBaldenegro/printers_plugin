import { Module } from '@nestjs/common';
import { ReprintController } from './reprint.controller';
import { ReprintService } from './reprint.service';
import { PrintService } from 'src/print/print.service';

@Module({
  controllers: [ReprintController],
  providers: [ReprintService, PrintService],
})
export class ReprintModule {
  // constructor(private reprintService: ReprintService) {}
  // @Post('togo/billPrint')
  // async printBillTicket(@Body() data: any): Promise<string> {
  //   try {
  //     await this.reprintService.reprintforPaymentTicketAction(
  //       data,
  //       PrintActions.REPRINT_FOR_PAY_ORDER_TOGO,
  //     );
  //     return 'Ticket impreso correctamente';
  //   } catch (error) {
  //     throw new NotFoundException('No se completo la impresion');
  //   }
  // }
}
