import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { SellsReportService } from './sells-report.service';

@Controller('sells-report')
export class SellsReportController {
  constructor(private readonly sellsReportService: SellsReportService) {}

  @Post('all')
  async getSellsReport(@Body() body: any) {
    try {
      const response = await this.sellsReportService.getSellsReport(body);
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }
}
