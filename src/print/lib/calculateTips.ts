interface Transaction {
  paymentType: string;
  quantity: string;
  payQuantity: string;
  tips: string;
}

function isValidNumber(value: string): boolean {
  const parsedValue = parseFloat(value);
  return !isNaN(parsedValue) && isFinite(parsedValue);
}

export const calculateTips = (transactions: Transaction[]) => {
  const tipTotal = transactions.reduce((total, transaction) => {
    if (!isValidNumber(transaction.tips)) return total;
    return total + parseFloat(transaction.tips);
  }, 0);
  return tipTotal;
};
