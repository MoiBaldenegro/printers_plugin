import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { SellsReportService } from './sells-report.service';

@Controller('sells-report')
export class SellsReportController {
  constructor(private readonly sellsReportService: SellsReportService) {}

  @Post('onsite')
  async getSellsReport(@Body() body: any) {
    try {
      const response = await this.sellsReportService.getSellsReport(body);
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  @Post('togo')
  async getTogoSellsReport(@Body() body: any) {
    try {
      const response = await this.sellsReportService.getTogoSellsReport(body);
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  @Post('rappi')
  async getRappiSellsReport(@Body() body: any) {
    try {
      const response = await this.sellsReportService.getRappiSellsReport(body);
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  @Post('phone')
  async getPhoneSellsReport(@Body() body: any) {
    try {
      const response = await this.sellsReportService.getPhoneSellsReport(body);
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }

  @Post('moje/:percent')
  async getMojeReport(@Body() body: any, @Param('percent') percent: string) {
    try {
      const response = await this.sellsReportService.getMojeReport(
        body,
        parseFloat(percent),
      );
      return response;
    } catch (error) {
      throw new NotFoundException('No se completo la impresion');
    }
  }
}
