/**
 * Returns color configuration based on current theme.
 * @param {string} theme - 'dark' or 'light'
 * @returns {object} color palette object
 */
function getColors(theme) {
  const dark = theme === 'dark';
  return {
    text:    dark ? '#e6edf3'  : '#1a202c',
    muted:   dark ? '#8b949e'  : '#718096',
    grid:    dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    accent:  dark ? '#818cf8'  : '#4f46e5',
    accent2: dark ? '#a78bfa'  : '#7c3aed',
    green:   dark ? '#34d399'  : '#10b981',
    red:     dark ? '#f87171'  : '#ef4444',
    cyan:    dark ? '#22d3ee'  : '#06b6d4',
    amber:   dark ? '#fbbf24'  : '#f59e0b',
    status:  dark ? ['#f87171','#34d399','#6b7280'] : ['#ef4444','#10b981','#6b7280'],
    palette: dark
      ? ['#818cf8','#a78bfa','#22d3ee','#34d399','#fbbf24','#f87171','#60a5fa','#fb923c','#e879f9','#4ade80','#38bdf8','#a3e635']
      : ['#4f46e5','#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444','#3b82f6','#f97316','#d946ef','#22c55e','#0ea5e9','#84cc16'],
  };
}

/**
 * Determine the next theme (toggle).
 * @param {string} currentTheme - 'dark' or 'light'
 * @returns {string} new theme
 */
function toggleThemeValue(currentTheme) {
  return currentTheme === 'dark' ? 'light' : 'dark';
}

/**
 * Get theme button display properties.
 * @param {string} theme - 'dark' or 'light'
 * @returns {{ iconClass: string, label: string }}
 */
function getThemeButtonProps(theme) {
  const dark = theme === 'dark';
  return {
    iconClass: dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon',
    label: dark ? 'Light Mode' : 'Dark Mode',
  };
}

module.exports = { getColors, toggleThemeValue, getThemeButtonProps };
