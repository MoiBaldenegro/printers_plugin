import { Module } from '@nestjs/common';
import { AssistanceReportController } from './assistance-report.controller';
import { AssistanceReportService } from './assistance-report.service';
import { PrintService } from 'src/print/print.service';

@Module({
  controllers: [AssistanceReportController],
  providers: [AssistanceReportService, PrintService],
})
export class AssistanceReportModule {}
