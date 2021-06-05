Array.prototype.includes = undefined as any;
String.prototype.includes = undefined as any;
Array.prototype.find = undefined as any;
window.CustomEvent = undefined as any;

import '../src/utils/polyfills';

describe('Polyfills', () => {
  test('Array.prototype.includes', () => {
    expect(Array.prototype.includes).toBeTruthy();
    expect([0, 1].includes(1)).toBeTruthy();
  });
  test('String.prototype.includes', () => {
    expect(String.prototype.includes).toBeTruthy();
    expect('[0, 1]'.includes('1')).toBeTruthy();
  });
  test('Array.prototype.find', () => {
    expect(Array.prototype.find).toBeTruthy();
    expect([0, 1].find(v => v == 1)).toBeTruthy();
  });
  test('Event', () => {
    const event = new Event('input', { bubbles: true });
    expect(event).toBeTruthy();
  });
});
