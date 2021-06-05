import * as React from 'react';
import { Locales, Currencies } from '../constants';

import {
  calculator,
  getNumbers,
  getOperators,
  replaceAllCalc,
  replaceAllNoCalc,
  removeNonRegister,
  removeNonNumerics,
  getDecimalSeparator,
  removeNonNumericsExceptDash,
} from '../utils';

export type PropsRegister = {
  style?: 'currency' | 'decimal';
  precision?: number;
  locale?: Locales | string;
  currency?: Currencies | string;
};

type ClickEvent = React.MouseEvent<HTMLInputElement, MouseEvent>;
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

const operators = ['-', '+', '/', '*'];

export type ReturnRegister = {
  format: (rawVal: string) => string;
  onClick: (e: ClickEvent) => void;
  onChange: (e: ChangeEvent) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  triggerChange: (value: string, input?: HTMLInputElement | null) => void;
  toNumber: (currency: string) => number;
  decimalSeparator: string;
};

const defaultValues = {
  precision: 2,
  style: 'currency',
  locale: Locales['Portuguese (Brazil)'],
  currency: Currencies['Brazilian Real'],
};

export const useCurrencyRegister = (props?: PropsRegister): ReturnRegister => {
  const { style, locale, precision, currency } = {
    ...defaultValues,
    ...props,
  };

  const decimalSeparator = getDecimalSeparator(locale);

  const toNumber = (currency: string) => {
    return (
      Number(removeNonNumericsExceptDash(currency)) / Math.pow(10, precision)
    );
  };

  const formatCurrency = (value: string, decimal?: 'decimal') => {
    return (
      Number(removeNonNumericsExceptDash(value)) / Math.pow(10, precision)
    ).toLocaleString(locale, {
      style: decimal || style,
      currency,
      minimumIntegerDigits: 1,
      minimumFractionDigits: precision,
    });
  };

  const isMathematicOperator = (lastChar: string) => {
    return operators.includes(lastChar);
  };

  const isMathematicOperation = (value: string) => {
    const operation = value.substr(1);
    return operators.find(o => operation.includes(o));
  };

  const calculateValue = (numbers: string[], operators: string[]) => {
    let value = '';
    if (operators.length && numbers.length > 1) {
      value = String(
        calculator(numbers[0], numbers[1], operators[0], decimalSeparator)
      );
    }

    return value;
  };

  // keep cursor to right
  const onClick = (e: ClickEvent) => {
    e.currentTarget.setSelectionRange(
      e.currentTarget.value.length,
      e.currentTarget.value.length
    );
  };

  const onChange = (e: ChangeEvent) => {
    const value = replaceAllCalc(e.currentTarget.value);

    const lastChar = value.slice(-1);
    const operators = getOperators(value);
    const numbers = getNumbers(value, decimalSeparator);

    if (isMathematicOperator(lastChar)) {
      if (operators.length === 1) {
        e.currentTarget.value = `${formatCurrency(
          numbers?.[0]
        )} ${operators?.[0]?.slice(-1)} `;
      } else {
        const calculatedValue = calculateValue(numbers, operators);
        if (!!value) {
          e.currentTarget.value = `${formatCurrency(calculatedValue)} ${
            operators?.[operators.length - 1]
          }`;
        }
      }
    } else {
      if (
        lastChar === decimalSeparator &&
        numbers?.[1]
          ?.substr(0, numbers?.[1]?.length - 1)
          ?.includes(decimalSeparator)
      ) {
        e.currentTarget.value = value.substr(0, value.length - 1);
      } else if (isMathematicOperation(removeNonRegister(value))) {
        let calculatedValue = '';
        if (lastChar === '=') {
          if (numbers.length === 1) {
            calculatedValue = numbers?.[0];
          } else {
            calculatedValue = calculateValue(numbers, operators);
          }
        }

        if (!!calculatedValue) {
          e.currentTarget.value = formatCurrency(calculatedValue);
        } else {
          e.currentTarget.value = `${formatCurrency(numbers?.[0])} ${
            operators?.[0]
          } ${
            ['-', '+'].includes(operators?.[0])
              ? formatCurrency(numbers?.[1], 'decimal')
              : numbers?.[1] || ''
          }`;
        }
      } else {
        e.currentTarget.value = formatCurrency(value);
      }
    }

    e.currentTarget.value = replaceAllNoCalc(e.currentTarget.value);
  };

  const triggerChange = (value: string, input?: HTMLInputElement | null) => {
    if (!!input) {
      const actualValue = input?.value;
      const inputProp = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      );
      const nativeInputValueSetter = inputProp?.set;
      if (nativeInputValueSetter) {
        const event = new Event('input', { bubbles: true });
        switch (value) {
          case 'L':
            const keyboardEvent = new KeyboardEvent('keydown', {
              bubbles: true,
              key: 'Delete',
            });
            input?.dispatchEvent(keyboardEvent);
            break;
          case 'C':
            nativeInputValueSetter?.call(input, ``);
            input?.dispatchEvent(event);
            break;
          default:
            nativeInputValueSetter?.call(input, `${actualValue}${value}`);
            input?.dispatchEvent(event);
            break;
        }
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (['Delete', 'Backspace'].includes(e.key)) {
      e.preventDefault();
      const input = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      );
      const nativeInputValueSetter = input?.set;
      if (nativeInputValueSetter) {
        const value = e.currentTarget.value.trim();
        const numbers = getNumbers(value, decimalSeparator);

        const zeros = removeNonNumerics(numbers?.[1]);

        nativeInputValueSetter?.call(
          e.currentTarget,
          Number(zeros) === 0
            ? value.substring(0, value.length - 5)
            : value.substring(0, value.length - 1)
        );
        const event = new Event('input', { bubbles: true });
        e.currentTarget?.dispatchEvent(event);
      }
    }
  };

  return {
    onClick,
    onChange,
    toNumber,
    onKeyDown,
    triggerChange,
    format: formatCurrency,
    decimalSeparator,
  };
};
