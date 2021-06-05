import React, { useEffect } from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { useCurrency } from '../src';

const App: React.FC = () => {
  const [negative, setNegative] = React.useState<'allow' | 'always' | 'never'>(
    'allow'
  );
  const [onClick, onChange, onKeyDown, formatCurrency] = useCurrency({
    style: 'decimal',
    negative,
  });
  const [value, setValue] = React.useState(formatCurrency('000'));

  useEffect(() => {
    setValue(current => formatCurrency(current));
  }, [negative]);

  const handleChangeNegative = () => {
    setNegative(negative === 'allow' ? 'always' : 'allow');
  };

  return (
    <div>
      <button data-testid="negative-button" onClick={handleChangeNegative} />
      <input
        data-testid="currency-input"
        type="text"
        onChange={e => {
          onChange(e);
          setValue(e.target.value);
        }}
        onClick={onClick}
        onKeyDown={onKeyDown}
        value={value}
      />
    </div>
  );
};

const makeSut = () => {
  render(<App />);
};

describe('useCurrency', () => {
  test('Should format initial value', () => {
    makeSut();
    const input = screen.getByTestId('currency-input') as HTMLInputElement;
    const value = input.value;
    expect(value).toBe('0,00');
  });
  test('Should keep cursor to right', () => {
    makeSut();
    const input = screen.getByTestId('currency-input') as HTMLInputElement;
    expect(input.selectionStart).toBe(0);
    fireEvent.click(input);
    expect(input.selectionStart).toBe(4);
  });
  test('Should format to currency with has number in string', () => {
    makeSut();
    const input = screen.getByTestId('currency-input') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '111abc1' } });
    const value = input.value;
    expect(value).toBe('11,11');
  });
  test('Should format to negative currency if negative allow and has negative signal', () => {
    makeSut();
    const input = screen.getByTestId('currency-input') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '-1111' } });
    const value = input.value;
    expect(value).toBe('-11,11');
    fireEvent.input(input, { target: { value: '1111-' } });
    expect(value).toBe('-11,11');
  });
  test('Should change value if type Delete', () => {
    makeSut();
    const input = screen.getByTestId('currency-input') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'Delete', code: 'Delete' });
    const value = input.value;
    expect(value).toBe('0,00');
  });
  test('Should format to negative currency if negative always', () => {
    makeSut();
    fireEvent.click(screen.getByTestId('negative-button'));
    const input = screen.getByTestId('currency-input') as HTMLInputElement;
    const value = input.value;
    expect(value).toBe('-0,00');
  });
});
