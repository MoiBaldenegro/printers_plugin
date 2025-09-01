import { Body, Controller, Post } from '@nestjs/common';
import { AssistanceReportService } from './assistance-report.service';

@Controller('assistance-report')
export class AssistanceReportController {
  constructor(
    private readonly assistanceReportService: AssistanceReportService,
  ) {}

  @Post('print-current')
  async printCurrentAssistanceReport(@Body() body: any) {
    await this.assistanceReportService.printCurrentAssistanceReport(body);
  }
}
