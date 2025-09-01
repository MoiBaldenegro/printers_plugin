import { Injectable } from '@nestjs/common';
import { printWorkTimeReportAction } from 'src/print/lib/assistance-reports/print-actions/workTimePrinterAction';
import { PrintService } from 'src/print/print.service';

@Injectable()
export class AssistanceReportService {
  constructor(private readonly printService: PrintService) {}

  private async getPrinter() {
    const readConfig = await this.printService.getTcpIp();
    const printer = await this.printService.createPrinter(readConfig);
    return printer;
  }

  async printCurrentAssistanceReport(body: any) {
    const printer = await this.getPrinter();
    await printWorkTimeReportAction(printer, body);
  }
}
