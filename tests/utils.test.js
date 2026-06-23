const { fmt, pct } = require('../src/utils');

describe('fmt (number formatting)', () => {
  test('formats zero', () => {
    expect(fmt(0)).toBe('0');
  });

  test('formats small numbers without separators', () => {
    expect(fmt(42)).toBe('42');
    expect(fmt(999)).toBe('999');
  });

  test('formats large numbers with locale separators', () => {
    const result = fmt(1000);
    // In en-US locale, should contain comma or other separator
    expect(result).toMatch(/1.?000/);
  });

  test('formats very large numbers', () => {
    const result = fmt(28526);
    expect(result).toMatch(/28.?526/);
  });

  test('formats negative numbers', () => {
    const result = fmt(-500);
    expect(result).toContain('500');
  });

  test('formats decimal numbers', () => {
    const result = fmt(3.14);
    expect(result).toContain('3');
  });
});

describe('pct (percentage calculation)', () => {
  test('returns 0% when denominator is zero', () => {
    expect(pct(5, 0)).toBe('0%');
  });

  test('returns 0% when denominator is negative', () => {
    expect(pct(5, -1)).toBe('0%');
  });

  test('calculates correct percentage', () => {
    expect(pct(50, 100)).toBe('50.0%');
  });

  test('calculates percentage with one decimal place', () => {
    expect(pct(1, 3)).toBe('33.3%');
  });

  test('returns 100.0% for full ratio', () => {
    expect(pct(100, 100)).toBe('100.0%');
  });

  test('handles zero numerator', () => {
    expect(pct(0, 100)).toBe('0.0%');
  });

  test('handles numerator larger than denominator', () => {
    expect(pct(200, 100)).toBe('200.0%');
  });

  test('rounds correctly', () => {
    expect(pct(2, 3)).toBe('66.7%');
  });

  test('handles very small percentages', () => {
    expect(pct(1, 10000)).toBe('0.0%');
  });

  test('handles precise fractions', () => {
    expect(pct(1, 8)).toBe('12.5%');
  });
});
