import { Injectable } from '@nestjs/common';
import { RestaurantUsersSells } from 'src/print/lib/sells-reports/users-sells/concreteReports';
import { PrintService } from 'src/print/print.service';

@Injectable()
export class SellsReportService {
  constructor(private readonly printService: PrintService) {}

  async getSellsReport(body: any) {
    const readConfig = await this.printService.getTcpIp();
    const printer = await this.printService.createPrinter(readConfig);
    const restaurantUsersSells = new RestaurantUsersSells(body);
    restaurantUsersSells.executeTemplate(printer);
    return restaurantUsersSells;
  }
}
