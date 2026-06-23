/**
 * Format a number with locale-specific separators.
 * @param {number} n
 * @returns {string}
 */
function fmt(n) {
  return n.toLocaleString();
}

/**
 * Calculate percentage string.
 * @param {number} n - numerator
 * @param {number} d - denominator
 * @returns {string} e.g. "42.5%"
 */
function pct(n, d) {
  return d > 0 ? ((n / d) * 100).toFixed(1) + '%' : '0%';
}

module.exports = { fmt, pct };
