import { ThermalPrinter } from 'node-thermal-printer';
import { printUserAllSalesAction } from './printUserAllSalesAction';
import { printMojeAction } from './printMojeAction';

export interface User {
  name: string;
  orders: any[];
  total: number;
}

export interface UserSells {
  name: string;
  total: number;
  ordersCount: number;
}
type State = {
  registers: UserSells[];
  total: number;
};

export abstract class UsersSellsTemplate {
  users: User[];
  constructor(users: User[]) {
    this.users = users;
  }

  abstract filterUserSells(): User[];

  buildRegister(user: User): UserSells {
    const sum = user.orders.reduce((acc: any, item: any) => {
      return acc + parseFloat(item.checkTotal || 0);
    }, 0);
    const register: UserSells = {
      name: user.name,
      total: sum,
      ordersCount: user.orders.length,
    };
    return register;
  }

  calculateTotal(UserSells: UserSells[]) {
    return UserSells.reduce((acc, sell) => acc + sell.total, 0); // retornamos el total de las ventas
  }

  formatData(registers: UserSells[], total: number) {
    const state: State = {
      registers,
      total,
    };
    return state;
  }

  printReport(state: State, printer: ThermalPrinter) {
    const registers = state.registers;
    const total = state.total;
    printUserAllSalesAction(printer, registers, total);
  }

  printMoje(state: State, printer: ThermalPrinter, percent: number) {
    const registers = state.registers;
    const total = state.total;
    printMojeAction(printer, registers, total, percent);
  }

  executeTemplate(printer: ThermalPrinter) {
    const filteredUsers: User[] = this.filterUserSells();
    const registers: UserSells[] = filteredUsers.map((user) =>
      this.buildRegister(user),
    );
    const total: number = this.calculateTotal(registers);
    const state: State = this.formatData(registers, total);
    this.printReport(state, printer);
  }

  executeMojeTemplate(printer: ThermalPrinter, percent: number) {
    const filteredUsers: User[] = this.filterUserSells();
    const registers: UserSells[] = filteredUsers.map((user) =>
      this.buildRegister(user),
    );
    const total: number = this.calculateTotal(registers);
    const state: State = this.formatData(registers, total);
    this.printMoje(state, printer, percent);
  }
}
