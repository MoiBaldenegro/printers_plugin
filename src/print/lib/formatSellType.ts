export enum SellsTypeOptions {
  RESTAURANT_ORDER = 'onSite',
  ON_SITE = 'ON_SITE',
  ON_SITE_ORDER = 'ON_SITE_ORDER',
  NOT_AVAILABLE = 'n/A',
  RAPPI_ORDER = 'RAPPI_ORDER',
  PHONE_ORDER = 'PHONE_ORDER',
  TOGO_ORDER = 'TOGO_ORDER',
}

export default function formatSellType(sellType: string): string {
  if (
    sellType === SellsTypeOptions.RESTAURANT_ORDER ||
    sellType === SellsTypeOptions.NOT_AVAILABLE ||
    sellType === SellsTypeOptions.ON_SITE_ORDER
  ) {
    return 'Restaurante';
  } else if (sellType === SellsTypeOptions.RAPPI_ORDER) {
    return 'Rappi';
  } else if (sellType === SellsTypeOptions.PHONE_ORDER) {
    return 'Telefono';
  } else if (sellType === SellsTypeOptions.TOGO_ORDER) {
    return 'Para llevar';
  } else {
    return '--';
  }
}
