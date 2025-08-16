import { User } from '../template';

export type BillsArray = {
  userCode: string;
  user: string;
  checkTotal: string;
};
export enum FilterType {
  ALL = 'ALL',
  TOGO_ORDER = 'TOGO_ORDER',
}
export const createUsersArray = (
  body: {
    data: BillsArray[];
    user: string;
  },
  filter: string = FilterType.ALL,
) => {
  if (filter !== FilterType.ALL) {
    return [];
  }
  const bodyData: BillsArray[] = body.data;
  const groupByUser = bodyData.reduce(
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
};
