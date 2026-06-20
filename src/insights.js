/**
 * Generate insight text data from aggregated results.
 */

const { fmt, pct } = require('./utils');

/**
 * Generate insights array from aggregated data.
 * @param {object} agg - aggregated data from aggregate()
 * @returns {Array<object>} array of insight objects with { icon, color, text }
 */
function generateInsights(agg) {
  const insights = [];

  insights.push({
    icon: 'fa-solid fa-globe',
    color: 'var(--accent1)',
    text: `Active in <strong>${agg.uniqueCountriesCount} countries</strong> in selection`,
  });

  const topC = agg.topCountries[0];
  if (topC) {
    insights.push({
      icon: 'fa-solid fa-flag',
      color: '#10b981',
      text: `<strong>${topC[0]}</strong> is the largest market — ${fmt(topC[1])} unique customers`,
    });
  }

  const blockPct = pct(agg.blocked, agg.total);
  insights.push({
    icon: 'fa-solid fa-ban',
    color: '#ef4444',
    text: `<strong>${blockPct}</strong> of unique customers are blocked`,
  });

  const cashTotal = (agg.termCount[0] || 0) + (agg.termCount[1] || 0) + (agg.termCount[2] || 0);
  const cashPct = pct(agg.termCount[0] || 0, cashTotal);
  insights.push({
    icon: 'fa-solid fa-coins',
    color: '#f59e0b',
    text: `Cash term: <strong>${cashPct}</strong> of accounts`,
  });

  let peakMonth = 'N/A', peakVal = 0;
  agg.trendLabels.forEach((l, i) => {
    if (agg.trendData[i] > peakVal) {
      peakVal = agg.trendData[i];
      peakMonth = l;
    }
  });
  insights.push({
    icon: 'fa-solid fa-chart-line',
    color: 'var(--accent2)',
    text: `Peak acquisition month: <strong>${peakMonth}</strong> (${fmt(peakVal)} customers)`,
  });

  return insights;
}

module.exports = { generateInsights };
