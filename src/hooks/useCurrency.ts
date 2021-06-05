import * as React from 'react';
import { Locales, Currencies } from '../constants';

import {
  removeNonNumerics,
  getDecimalSeparator,
  removeNonNumericsExceptDash,
} from '../utils';

export type CurrencyProps = {
  style?: 'currency' | 'decimal';
  precision?: number;
  locale?: Locales | string;
  currency?: Currencies | string;
  negative?: 'allow' | 'always' | 'never';
};

export type ClickEvent = React.MouseEvent<HTMLInputElement, MouseEvent>;
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

export type ReturnCurrency = {
  format: (rawVal: string) => string;
  onClick: (e: ClickEvent) => void;
  onChange: (e: ChangeEvent) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  toNumber: (currency: string) => number;
  decimalSeparator: string;
};

const defaultValues = {
  precision: 2,
  style: 'currency',
  locale: Locales['Portuguese (Brazil)'],
  currency: Currencies['Brazilian Real'],
  negative: 'allow',
};

export const useCurrency = (props?: CurrencyProps): ReturnCurrency => {
  const { style, locale, precision, currency, negative } = {
    ...defaultValues,
    ...props,
  };

  const decimalSeparator = getDecimalSeparator(locale);

  const toNumber = (currency: string) => {
    return (
      Number(removeNonNumericsExceptDash(currency)) / Math.pow(10, precision)
    );
  };

  const formatCurrency = (value: string) => {
    return `${formatNegative(value)}${(
      Number(removeNonNumerics(value)) / Math.pow(10, precision)
    ).toLocaleString(locale, {
      style,
      currency,
      minimumIntegerDigits: 1,
      minimumFractionDigits: precision,
    })}`;
  };

  const formatNegative = (value: string): string => {
    let dash = '';
    const firstEntry = value?.charAt(0);
    const lastEntry = value?.substring(value?.length - 1);

    if (negative === 'always') {
      dash = '-';
    } else if (negative === 'allow') {
      if (lastEntry === '-') {
        if (firstEntry !== '-') {
          dash = '-';
        }
      } else if (firstEntry === '-') {
        dash = '-';
      }
    }
    return dash;
  };

  // keep cursor to right
  const onClick = (e: ClickEvent) => {
    e.currentTarget.setSelectionRange(
      e.currentTarget.value.length,
      e.currentTarget.value.length
    );
  };

  const onChange = (e: ChangeEvent) => {
    const value = e.currentTarget.value;
    e.currentTarget.value = formatCurrency(value);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (['Delete'].includes(e.key)) {
      const input = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      );
      const nativeInputValueSetter = input?.set;
      if (nativeInputValueSetter) {
        const value = e.currentTarget.value;
        nativeInputValueSetter!.call(
          e.currentTarget,
          value.substring(0, value.length - 1)
        );
        const event = new Event('input', { bubbles: true });
        e.currentTarget?.dispatchEvent(event);
      }
    }
  };

  return {
    onClick,
    onChange,
    onKeyDown,
    format: formatCurrency,
    decimalSeparator,
    toNumber,
  };
};
