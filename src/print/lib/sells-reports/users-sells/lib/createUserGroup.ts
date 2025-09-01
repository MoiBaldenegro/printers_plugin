import { User } from '../template';
import { BillsArray } from './createUsersArray';

export function createdUserGroup(billArray: BillsArray[]) {
  const groupByUser = billArray.reduce(
    (acc: { [key: string]: BillsArray[] }, item: BillsArray) => {
      const key = item.userCode;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {},
  );

  const usersArray: User[] = Object.entries(groupByUser).map(
    ([key, value]: any) => {
      return {
        name: `${key} ${value[0].user}`,
        orders: value,
        total: 0,
      };
    },
  );

  return usersArray;
}
