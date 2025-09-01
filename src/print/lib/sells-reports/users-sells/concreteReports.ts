import {
  BillsArray,
  createUsersArray,
  FilterType,
} from './lib/createUsersArray';
import { User, UsersSellsTemplate } from './template';

export class RestaurantUsersSells extends UsersSellsTemplate {
  constructor(body: { data: BillsArray[]; user: string }) {
    const usersArray: User[] = createUsersArray(body, FilterType.ON_SITE);
    super(usersArray);
  }

  override filterUserSells(): User[] {
    return this.users;
  }
}

export class TogoOrdersUsersSells extends UsersSellsTemplate {
  constructor(body: { data: BillsArray[]; user: string }) {
    const usersArray: User[] = createUsersArray(body, FilterType.TOGO_ORDER);
    super(usersArray);
  }

  override filterUserSells(): User[] {
    return this.users;
  }
}

export class RappiOrdersUsersSells extends UsersSellsTemplate {
  constructor(body: { data: BillsArray[]; user: string }) {
    const usersArray: User[] = createUsersArray(body, FilterType.RAPPI_ORDER);
    super(usersArray);
  }

  override filterUserSells(): User[] {
    return this.users;
  }
}

export class PhoneOrdersUsersSells extends UsersSellsTemplate {
  constructor(body: { data: BillsArray[]; user: string }) {
    const usersArray: User[] = createUsersArray(body, FilterType.PHONE_ORDER);
    super(usersArray);
  }

  override filterUserSells(): User[] {
    return this.users;
  }
}
