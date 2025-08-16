export enum PaymentType {
  CASH = 'cash',
  DEBIT = 'debit',
  CREDIT = 'credit',
  TRANSFER = 'transfer',
  QR_CODE = 'qrCode',
}

export const formatPaymentType = (paymentType: PaymentType): string => {
  switch (paymentType) {
    case PaymentType.CASH:
      return 'Efectivo';
    case PaymentType.DEBIT:
      return 'Tarjeta de débito';
    case PaymentType.CREDIT:
      return 'Tarjeta de crédito';
    case PaymentType.TRANSFER:
      return 'Transferencia';
    case PaymentType.QR_CODE:
      // return 'Código QR';
      return 'Tarjetas';
    default:
      return 'Desconocido';
  }
};
