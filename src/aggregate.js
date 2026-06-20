/**
 * Core data aggregation logic for the dashboard.
 * Takes raw row data and filter parameters, returns aggregated metrics.
 */

/**
 * Aggregate rows based on filters.
 * @param {object} params
 * @param {Array} params.rows - Array of row tuples: [countryIdx, branchIdx, lovIdx, kycIdx, termIdx, msmeIdx, "YYYY-MM"]
 * @param {Array} params.countries - Array of country names
 * @param {Array} params.branches - Array of branch names
 * @param {Array} params.lovVals - Array of LOV status values
 * @param {object} params.filters - { country, branch, status, kyc, dateFrom, dateTo }
 * @returns {object} Aggregated data
 */
function aggregate({ rows, countries, branches, lovVals, filters }) {
  const f = filters;
  const cIdx = f.country ? countries.indexOf(f.country) : -1;
  const bIdx = f.branch ? branches.indexOf(f.branch) : -1;
  const lIdx = f.status ? lovVals.indexOf(f.status) : -1;
  const kIdx = f.kyc === 'YES' ? 1 : f.kyc === 'NO' ? 0 : -1;

  const countryCount = {};
  const branchCount = {};
  const lovCount = { 0: 0, 1: 0, 2: 0 };
  const kycCount = { 0: 0, 1: 0 };
  const termCount = { 0: 0, 1: 0, 2: 0 };
  const msmeCount = { 0: 0, 1: 0 };
  const monthCount = {};
  const uniqueCountriesSet = new Set();
  let total = 0, blocked = 0, active = 0, recent = 0;

  for (const r of rows) {
    const [ci, bi, li, ki, ti, mi, ym] = r;

    if (cIdx !== -1 && ci !== cIdx) continue;
    if (bIdx !== -1 && bi !== bIdx) continue;
    if (lIdx !== -1 && li !== lIdx) continue;
    if (kIdx !== -1 && ki !== kIdx) continue;
    if (f.dateFrom && ym < f.dateFrom) continue;
    if (f.dateTo && ym > f.dateTo) continue;

    total++;
    if (li === 0) blocked++;
    if (li === 1) active++;
    if (ym >= '2020-01') recent++;

    if (ci >= 0) {
      countryCount[ci] = (countryCount[ci] || 0) + 1;
      uniqueCountriesSet.add(ci);
    }
    if (bi >= 0) branchCount[bi] = (branchCount[bi] || 0) + 1;
    lovCount[li] = (lovCount[li] || 0) + 1;
    if (ki === 0 || ki === 1) kycCount[ki] = (kycCount[ki] || 0) + 1;
    if (ti >= 0 && ti < 3) termCount[ti] = (termCount[ti] || 0) + 1;
    if (mi >= 0 && mi < 2) msmeCount[mi] = (msmeCount[mi] || 0) + 1;
    if (ym) monthCount[ym] = (monthCount[ym] || 0) + 1;
  }

  const topCountries = Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([i, v]) => [countries[i], v]);

  const topBranches = Object.entries(branchCount)
    .sort((a, b) => b[1] - a[1])
    .map(([i, v]) => [branches[i], v]);

  const trendLabels = Object.keys(monthCount).sort();
  const trendData = trendLabels.map(k => monthCount[k]);

  return {
    total,
    blocked,
    active,
    recent,
    uniqueCountriesCount: uniqueCountriesSet.size,
    topCountries,
    topBranches,
    lovCount,
    kycCount,
    termCount,
    msmeCount,
    trendLabels,
    trendData,
  };
}

module.exports = { aggregate };
