import { Locales } from '../constants';

export function removeNonNumerics(raw: string) {
  return raw?.replace(/[^0-9]/g, '');
}

export function removeNonNumericsExceptDash(raw: string) {
  const dash = raw?.charAt(0) === '-' ? '-' : '';
  return `${dash}${raw?.replace(/[^0-9]/g, '')}`;
}

export function removeNonRegister(raw: string, decimalSeparator?: string) {
  let regex = new RegExp(`[^0-9\\/\\=\\+\\-\\*\\${decimalSeparator}]`, 'g');
  return raw ? raw.replace(regex, '') : raw;
}

export function getOperators(raw: string) {
  return removeNonRegister(raw)
    .substr(1)
    .split(/[^\+\-\*\/]/)
    .filter(String);
}

export function getNumbers(raw: string, decimalSeparator: string) {
  let regex = new RegExp(`[^0-9\\${decimalSeparator}]`, 'g');
  return removeNonRegister(raw, decimalSeparator)
    .split(regex)
    .filter(String)
    .map((v, idx) => (idx === 0 ? `${hasDash(raw)}${v}` : v));
}

export function hasDash(raw: string) {
  return raw.charAt(0) === '-' ? '-' : '';
}

export function getDecimalSeparator(locale: Locales | string) {
  let n = 1.1;
  return n.toLocaleString(locale).substring(1, 2);
}

export function calculator(
  num1: string,
  num2: string,
  operator: string,
  decimalSeparator: string
) {
  const val1 = Number(num1.split(decimalSeparator).join('.'));
  const val2 = Number(num2.split(decimalSeparator).join('.'));

  return eval(`${val1}${operator}${val2}`)?.toFixed(2);
}

export function replaceAllCalc(value: string) {
  if (value.includes('x')) {
    value = value.split('x').join('*');
  }

  if (value.includes('÷')) {
    value = value.split('÷').join('/');
  }

  return value;
}

export function replaceAllNoCalc(value: string) {
  if (value.includes('*')) {
    value = value.split('*').join('x');
  }

  if (value.includes('/')) {
    value = value.split('/').join('÷');
  }

  return value;
}
