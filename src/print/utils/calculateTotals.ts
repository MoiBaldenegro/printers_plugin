export const SET_PERCENT = 'SET_PERCENT';
export const SET_QUANTITY = 'SET_QUANTITY';
export const COURTESY_APPLY_NOTES = 'COURTESY_APPLY_NOTES';
export const COURTESY_APPLY_BILL = 'COURTESY_APPLY_BILL';

export const calculateDiscount = (
  amount: number,
  quantityDiscount: number,
  setting: string,
) => {
  if (setting === SET_PERCENT) {
    return (amount * quantityDiscount) / 100;
  }
  if (setting === SET_QUANTITY) {
    return quantityDiscount;
  }
  return 0;
};

interface Price {
  name: string;
  price: number;
}

interface Dish {
  name: string;
  prices: Price[];
}

interface Product {
  quantity: number;
  prices: Price[];
  dishes?: Dish[];
  discount?: any;
  discountedAmount?: string;
}

// Calcula el total de un solo producto, incluyendo `dishes` si existen.
export const calculateProductTotal = (
  product: Product,
  withDishes = false,
  unitary = false,
  sellType: string = 'ON_SITE',
): number => {
  if (!product) return 0;
  const { quantity, prices, dishes, discount } = product;
  const priceIndex = prices.findIndex((price) => price.name === sellType) ?? 0;
  const dishesPriceIndex = sellType === 'RAPPI' ? 3 : 0;

  // Calcula el total del producto base (sin dishes).
  const baseTotal = quantity * prices[priceIndex].price;
  if (discount && discount.discountMount === '100') {
    return 0;
  }

  if (unitary) {
    if (dishes && withDishes) {
      const dishesTotal = dishes.reduce((sum, dish) => {
        if (dish.prices.length > 0) {
          return discount
            ? sum +
                dish.prices[dishesPriceIndex].price -
                parseFloat(
                  product?.discountedAmount ?? discount?.discountedAmount,
                )
            : sum + dish.prices[dishesPriceIndex].price;
        }
        return discount
          ? sum -
              parseFloat(
                product?.discountedAmount ?? discount?.discountedAmount,
              )
          : sum;
      }, 0);
      // Suma el total del producto base con el total de los dishes.
      return discount
        ? prices[priceIndex].price +
            dishesTotal -
            parseFloat(product?.discountedAmount ?? discount?.discountedAmount)
        : prices[priceIndex].price + dishesTotal;
    }
    return discount
      ? prices[priceIndex].price -
          parseFloat(product?.discountedAmount ?? discount?.discountedAmount)
      : prices[priceIndex].price;
  }

  if (dishes && withDishes) {
    // Calcula el total de los primeros precios de los dishes.
    const dishesTotal = dishes.reduce((sum, dish) => {
      if (dish.prices.length > 0) {
        return sum + dish.prices[dishesPriceIndex].price * quantity;
      }
      return sum;
    }, 0);

    // Suma el total del producto base con el total de los dishes.
    return discount?.discountedAmount
      ? baseTotal -
          parseFloat(product?.discountedAmount ?? discount?.discountedAmount) +
          (dishesTotal -
            parseFloat(calculateDishesDiscount(dishesTotal, discount)))
      : baseTotal + dishesTotal;
  }

  return discount
    ? baseTotal -
        parseFloat(product?.discountedAmount ?? discount?.discountedAmount)
    : baseTotal;
};

export const productTotalWithDiscount = (product: Product): number => {
  if (!product?.discount) {
    return calculateProductTotal(product);
  }
  // aca vamos con lña logica para hacer los descuentos
  return 666;
};

// Calcula el total de una lista de productos.
export const calculateBillTotal = (
  products: Product[],
  discount?: any,
  sellType?: string,
): string => {
  if (!products?.length) return '0.00s';

  if (
    discount?.discountType === COURTESY_APPLY_NOTES ||
    discount?.discountType === COURTESY_APPLY_BILL
  ) {
    return '0.00';
  }

  // Suma el total de cada producto (incluyendo sus dishes) usando `calculateProductTotal`.
  const total = products.reduce(
    (sum, product) =>
      sum + calculateProductTotal(product, true, false, sellType),
    0,
  );

  const areProductDiscount = products?.some((element) => element?.discount);

  // logica por aca //
  // para recalcular descuento //
  // aca lo que hace falta es volver a recalcular un descuento

  if (areProductDiscount) {
    const newDiscountedAmount = calculateDiscount(
      total,
      parseFloat(discount?.discountMount),
      discount?.setting,
    );
    return discount
      ? (total - newDiscountedAmount).toFixed(2).toString()
      : total.toFixed(2).toString();
  }

  return discount && discount !== null
    ? (total - parseFloat(discount?.totalDiscountQuantity))
        .toFixed(2)
        .toString()
    : total.toFixed(2).toString();
};

export const calculateDishesDiscount = (dishesAmount, discount) => {
  if (!discount) return 0;
  const { setting, discountMount } = discount;
  if (setting === SET_PERCENT) {
    return (dishesAmount * discountMount) / 100;
  }
  if (setting === SET_QUANTITY) {
    return discountMount;
  }
  return 0;
};
