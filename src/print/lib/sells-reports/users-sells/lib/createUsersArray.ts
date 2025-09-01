import { SellsTypeOptions } from 'src/print/lib/formatSellType';
import { createdUserGroup } from './createUserGroup';

export type BillsArray = {
  userCode: string;
  user: string;
  checkTotal: string;
  sellType: SellsTypeOptions;
  status: string;
};

export enum FilterType {
  ALL = 'ALL',
  ON_SITE = 'ON_SITE',
  TOGO_ORDER = 'TOGO_ORDER',
  RAPPI_ORDER = 'RAPPI_ORDER',
  PHONE_ORDER = 'PHONE_ORDER',
}
export const createUsersArray = (
  body: {
    data: BillsArray[];
    user: string;
  },
  filter: string = FilterType.ALL,
) => {
  const bodyData: BillsArray[] = body.data;
  let filteredArray = [];
  if (filter === FilterType.ON_SITE) {
    const filteredBill = bodyData.filter((item) => {
      if (
        (item.sellType === SellsTypeOptions.NOT_AVAILABLE ||
          item.sellType === SellsTypeOptions.ON_SITE_ORDER ||
          item.sellType === SellsTypeOptions.RESTAURANT_ORDER) &&
        item.status === 'finished'
      ) {
        return true;
      }
      return false;
    });
    filteredArray = createdUserGroup(filteredBill);
  } else if (filter === FilterType.TOGO_ORDER) {
    const filteredBill = bodyData.filter((item) => {
      if (
        item.sellType === SellsTypeOptions.TOGO_ORDER &&
        item.status === 'finished'
      ) {
        return true;
      }
      return false;
    });
    filteredArray = createdUserGroup(filteredBill);
  } else if (filter === FilterType.RAPPI_ORDER) {
    const filteredBill = bodyData.filter((item) => {
      if (
        item.sellType === SellsTypeOptions.RAPPI_ORDER &&
        item.status === 'finished'
      ) {
        return true;
      }
      return false;
    });
    filteredArray = createdUserGroup(filteredBill);
  } else if (filter === FilterType.PHONE_ORDER) {
    const filteredBill = bodyData.filter((item) => {
      if (
        item.sellType === SellsTypeOptions.PHONE_ORDER &&
        item.status === 'finished'
      ) {
        return true;
      }
      return false;
    });
    filteredArray = createdUserGroup(filteredBill);
  } else {
    filteredArray = createdUserGroup(bodyData);
  }
  return filteredArray;
};
