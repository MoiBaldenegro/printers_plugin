export enum SellsTypeOptions {
  RESTAURANT_ORDER = 'onSite',
  RAPPI_ORDER = 'RAPPI_ORDER',
  PHONE_ORDER = 'PHONE_ORDER',
  TOGO_ORDER = 'TOGO_ORDER',
}

export default function formatSellType(sellType: string): string {
  if (
    sellType === SellsTypeOptions.RESTAURANT_ORDER ||
    sellType === 'n/A' ||
    sellType === 'ON_SITE_ORDER'
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
