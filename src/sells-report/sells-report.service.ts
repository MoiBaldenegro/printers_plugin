import { Injectable } from '@nestjs/common';
import {
  PhoneOrdersUsersSells,
  RappiOrdersUsersSells,
  RestaurantUsersSells,
  TogoOrdersUsersSells,
} from 'src/print/lib/sells-reports/users-sells/concreteReports';
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

  async getTogoSellsReport(body: any) {
    const readConfig = await this.printService.getTcpIp();
    const printer = await this.printService.createPrinter(readConfig);
    const restaurantUsersSells = new TogoOrdersUsersSells(body);
    restaurantUsersSells.executeTemplate(printer);
    return restaurantUsersSells;
  }

  async getRappiSellsReport(body: any) {
    const readConfig = await this.printService.getTcpIp();
    const printer = await this.printService.createPrinter(readConfig);
    const restaurantUsersSells = new RappiOrdersUsersSells(body);
    restaurantUsersSells.executeTemplate(printer);
    return restaurantUsersSells;
  }

  async getPhoneSellsReport(body: any) {
    const readConfig = await this.printService.getTcpIp();
    const printer = await this.printService.createPrinter(readConfig);
    const restaurantUsersSells = new PhoneOrdersUsersSells(body);
    restaurantUsersSells.executeTemplate(printer);
    return restaurantUsersSells;
  }

  async getMojeReport(body: any, percent: number) {
    const readConfig = await this.printService.getTcpIp();
    const printer = await this.printService.createPrinter(readConfig);
    const restaurantUsersSells = new RestaurantUsersSells(body);
    restaurantUsersSells.executeMojeTemplate(printer, percent);
    return restaurantUsersSells;
  }
}
