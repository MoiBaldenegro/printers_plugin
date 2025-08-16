enum PaymentType {
  CASH = 'cash',
  DEBIT = 'debit',
  CREDIT = 'credit',
  TRANSFER = 'transfer',
  QR_CODE = 'qrCode',
}

interface Transaction {
  paymentType: PaymentType;
  quantity: string | number;
  payQuantity: string | number;
  tips: string | number;
}

interface AggregatedResult {
  totalQuantity: number;
  totalPayQuantity: number;
  totalTips: number;
}

const isValidNumber = (value: any): boolean => {
  const n = Number(value);
  return typeof value !== 'boolean' && value !== '' && !isNaN(n);
};

export const setRevolveAction = (transactions: Transaction[]) => {
  const transAgrouped: Record<string, AggregatedResult> = {};

  for (const payType of Object.values(PaymentType)) {
    let totalQuantity = 0;
    let totalPayQuantity = 0;
    let totalTips = 0;

    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      if (tx.paymentType === payType) {
        totalQuantity += isValidNumber(tx.quantity) ? Number(tx.quantity) : 0;
        totalPayQuantity += isValidNumber(tx.payQuantity)
          ? Number(tx.payQuantity)
          : 0;
        totalTips += isValidNumber(tx.tips) ? Number(tx.tips) : 0;
      }
    }

    transAgrouped[payType] = {
      totalQuantity,
      totalPayQuantity,
      totalTips,
    };
  }

  return transAgrouped;
};
