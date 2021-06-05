import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { ReturnRegister, useCurrencyRegister } from '../src';

const App: React.FC<ReturnRegister> = (props: ReturnRegister) => {
  const { onClick, onChange, format, onKeyDown } = props;

  return (
    <div>
      <input
        onClick={onClick}
        onChange={onChange}
        onKeyDown={onKeyDown}
        defaultValue={format('0,00')}
        data-testid="input-register"
      />
    </div>
  );
};

const makeSut = () => {
  const props = useCurrencyRegister({
    style: 'decimal',
  });
  return {
    sut: render(<App {...props} />),
    triggerChange: props.triggerChange,
  };
};

describe('useCurrencyRegister', () => {
  test('should format initial value', () => {
    makeSut();
    const input = screen.getByTestId('input-register');
    expect(input).toHaveProperty('value', '0,00');
  });
  test('Should keep cursor to right', () => {
    makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    expect(input.selectionStart).toBe(0);
    fireEvent.click(input);
    expect(input.selectionStart).toBe(4);
  });
  test('Should not be able to put to decimal separator', () => {
    makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '3,00 - 2,00,' } });
    expect(input.value).toBe('3,00 - 2,00');
  });
  test('Should not be able to put to decimal separator', () => {
    makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '3,00 -=' } });
    expect(input.value).toBe('3,00');
  });
  test('should subtraction 2 number', () => {
    makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '200' } });
    expect(input.value).toBe('2,00');
    fireEvent.input(input, { target: { value: '200 -' } });
    expect(input.value).toBe('2,00 - ');
    fireEvent.input(input, { target: { value: '200 - 200' } });
    expect(input.value).toBe('2,00 - 2,00');
    fireEvent.input(input, { target: { value: '3,00 - 2,00 -' } });
    expect(input.value).toBe('1,00 -');
  });
  test('should sum 2 number', () => {
    makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '3,00 + 2,00 =' } });
    expect(input.value).toBe('5,00');
  });
  test('should divide 2 number', () => {
    makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '7,00 / 3 =' } });
    expect(input.value).toBe('2,33');
    fireEvent.input(input, { target: { value: '7,00 / 3,00000 =' } });
    expect(input.value).toBe('2,33');
    fireEvent.input(input, { target: { value: '3,33 ÷ 2,93 =' } });
    expect(input.value).toBe('1,14');
  });
  test('should multiplicate 2 number', () => {
    makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '3,33 * 2,93 =' } });
    expect(input.value).toBe('9,76');
    fireEvent.input(input, { target: { value: '3 x -2 =' } });
    expect(input.value).toBe('-6,00');
  });
  test('Should change value if type Delete', () => {
    makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '3,00 * 2' } });
    fireEvent.keyDown(input, { key: 'Delete', code: 'Delete' });
    const value = input.value;
    expect(value).toBe('3,00 x ');
  });
});

describe('useCurrencyRegister triggerChange', () => {
  test('should format initial value', () => {
    const { triggerChange } = makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    triggerChange('L', input);
    expect(input).toHaveProperty('value', '0,00');
  });
  test('should format initial value', () => {
    const { triggerChange } = makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    triggerChange('C', input);
    expect(input).toHaveProperty('value', '0,00');
  });
  test('should format initial value', () => {
    const { triggerChange } = makeSut();
    const input = screen.getByTestId('input-register') as HTMLInputElement;
    triggerChange('1', input);
    expect(input).toHaveProperty('value', '0,01');
  });
});
