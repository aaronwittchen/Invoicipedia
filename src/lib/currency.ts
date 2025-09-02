export type Currency = 'usd' | 'eur';

export const CURRENCIES: Record<Currency, { symbol: string; name: string; code: string }> = {
  usd: {
    symbol: '$',
    name: 'USD',
    code: 'usd'
  },
  eur: {
    symbol: '€',
    name: 'EUR',
    code: 'eur'
  }
};

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCIES[currency].symbol;
}

export function getCurrencyName(currency: Currency): string {
  return CURRENCIES[currency].name;
}

export function getCurrencyDisplay(currency: Currency): string {
  const { name, symbol } = CURRENCIES[currency];
  return `${name} (${symbol})`;
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${(amount / 100).toFixed(2)}`;
}

export function isValidCurrency(currency: string): currency is Currency {
  return currency === 'usd' || currency === 'eur';
}
