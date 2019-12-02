type CurrencyGeneric = { [key: string]: number };
interface Currency {
  platinum: number;
  gold: number;
  electrum: number;
  silver: number;
  copper: number;
}

const CONVERSION_FACTOR: CurrencyGeneric = {
  platinum: 10 ** 3,
  gold: 10 ** 2,
  electrum: 10 * 5,
  silver: 10,
  copper: 1,
};

export function convertCurrencyDisplay(copperCount: number): Currency {
  const currency: CurrencyGeneric = {
    platinum: 0,
    gold: 0,
    electrum: 0,
    silver: 0,
    copper: 0,
  };
  let remainder = copperCount;
  for (const coin in currency) {
    currency[coin] = Math.floor(remainder / CONVERSION_FACTOR[coin]);
    remainder = copperCount % CONVERSION_FACTOR[coin];
  }
  return currency as {
    platinum: number;
    gold: number;
    electrum: number;
    silver: number;
    copper: number;
  };
}

export function convertCurrencyStorage(type: string, count: number): number {
  return CONVERSION_FACTOR[type] * count;
}
