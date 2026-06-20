const { getColors, toggleThemeValue, getThemeButtonProps } = require('../src/theme');

describe('getColors', () => {
  test('returns light theme colors by default', () => {
    const c = getColors('light');
    expect(c.text).toBe('#1a202c');
    expect(c.muted).toBe('#718096');
    expect(c.accent).toBe('#4f46e5');
    expect(c.green).toBe('#10b981');
    expect(c.red).toBe('#ef4444');
    expect(c.cyan).toBe('#06b6d4');
    expect(c.amber).toBe('#f59e0b');
  });

  test('returns dark theme colors', () => {
    const c = getColors('dark');
    expect(c.text).toBe('#e6edf3');
    expect(c.muted).toBe('#8b949e');
    expect(c.accent).toBe('#818cf8');
    expect(c.green).toBe('#34d399');
    expect(c.red).toBe('#f87171');
    expect(c.cyan).toBe('#22d3ee');
    expect(c.amber).toBe('#fbbf24');
  });

  test('light theme has correct grid opacity', () => {
    const c = getColors('light');
    expect(c.grid).toBe('rgba(0,0,0,0.06)');
  });

  test('dark theme has correct grid opacity', () => {
    const c = getColors('dark');
    expect(c.grid).toBe('rgba(255,255,255,0.06)');
  });

  test('status array has 3 colors', () => {
    const c = getColors('light');
    expect(c.status).toHaveLength(3);
  });

  test('palette array has 12 colors', () => {
    const c = getColors('light');
    expect(c.palette).toHaveLength(12);
  });

  test('dark palette array has 12 colors', () => {
    const c = getColors('dark');
    expect(c.palette).toHaveLength(12);
  });

  test('light and dark palettes differ', () => {
    const light = getColors('light');
    const dark = getColors('dark');
    expect(light.palette[0]).not.toBe(dark.palette[0]);
  });

  test('non-dark string returns light theme', () => {
    const c = getColors('something-else');
    expect(c.text).toBe('#1a202c');
  });
});

describe('toggleThemeValue', () => {
  test('toggles dark to light', () => {
    expect(toggleThemeValue('dark')).toBe('light');
  });

  test('toggles light to dark', () => {
    expect(toggleThemeValue('light')).toBe('dark');
  });

  test('unknown theme toggles to dark (not dark)', () => {
    expect(toggleThemeValue('unknown')).toBe('dark');
  });
});

describe('getThemeButtonProps', () => {
  test('dark theme shows sun icon and Light Mode label', () => {
    const props = getThemeButtonProps('dark');
    expect(props.iconClass).toBe('fa-solid fa-sun');
    expect(props.label).toBe('Light Mode');
  });

  test('light theme shows moon icon and Dark Mode label', () => {
    const props = getThemeButtonProps('light');
    expect(props.iconClass).toBe('fa-solid fa-moon');
    expect(props.label).toBe('Dark Mode');
  });
});
