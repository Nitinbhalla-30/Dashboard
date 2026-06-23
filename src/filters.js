/**
 * Filter management logic for the dashboard.
 */

/**
 * Extract filter values from DOM elements.
 * @param {Document} doc - document reference
 * @returns {object} filter values
 */
function getFilters(doc) {
  return {
    country: doc.getElementById('filterCountry').value,
    branch: doc.getElementById('filterBranch').value,
    status: doc.getElementById('filterStatus').value,
    kyc: doc.getElementById('filterKYC').value,
    dateFrom: doc.getElementById('filterDateFrom').value.substring(0, 7),
    dateTo: doc.getElementById('filterDateTo').value.substring(0, 7),
  };
}

/**
 * Reset all filter elements to default values.
 * @param {Document} doc - document reference
 */
function resetFilters(doc) {
  doc.getElementById('filterCountry').value = '';
  doc.getElementById('filterBranch').value = '';
  doc.getElementById('filterStatus').value = '';
  doc.getElementById('filterKYC').value = '';
  doc.getElementById('filterDateFrom').value = '2012-12-27';
  doc.getElementById('filterDateTo').value = '2021-05-16';
}

/**
 * Populate filter dropdowns with options.
 * @param {Document} doc - document reference
 * @param {Array} countries - array of country names
 * @param {Array} branches - array of branch names
 */
function populateFilters(doc, countries, branches) {
  const cs = doc.getElementById('filterCountry');
  countries.forEach(c => {
    const o = doc.createElement('option');
    o.value = c;
    o.textContent = c;
    cs.appendChild(o);
  });
  const bs = doc.getElementById('filterBranch');
  branches.forEach(b => {
    const o = doc.createElement('option');
    o.value = b;
    o.textContent = b.length > 45 ? b.substring(0, 45) + '…' : b;
    bs.appendChild(o);
  });
}

module.exports = { getFilters, resetFilters, populateFilters };
