/**
 * @jest-environment jsdom
 */
const { getFilters, resetFilters, populateFilters } = require('../src/filters');

function setupFilterDOM() {
  document.body.innerHTML = `
    <select id="filterCountry"><option value="">All Countries</option></select>
    <select id="filterBranch"><option value="">All Branches</option></select>
    <select id="filterStatus">
      <option value="">All Statuses</option>
      <option>BLOCK</option><option>DISPLAY</option><option>HIDE</option>
    </select>
    <select id="filterKYC">
      <option value="">All</option><option>YES</option><option>NO</option>
    </select>
    <input type="date" id="filterDateFrom" value="2012-12-27">
    <input type="date" id="filterDateTo" value="2021-05-16">
  `;
}

describe('getFilters', () => {
  beforeEach(setupFilterDOM);

  test('returns default filter values', () => {
    const f = getFilters(document);
    expect(f.country).toBe('');
    expect(f.branch).toBe('');
    expect(f.status).toBe('');
    expect(f.kyc).toBe('');
    expect(f.dateFrom).toBe('2012-12');
    expect(f.dateTo).toBe('2021-05');
  });

  test('reads country filter value', () => {
    // Must add the option first for jsdom select to accept the value
    const select = document.getElementById('filterCountry');
    const opt = document.createElement('option');
    opt.value = 'INDIA';
    opt.textContent = 'INDIA';
    select.appendChild(opt);
    select.value = 'INDIA';
    const f = getFilters(document);
    expect(f.country).toBe('INDIA');
  });

  test('reads branch filter value', () => {
    const select = document.getElementById('filterBranch');
    const opt = document.createElement('option');
    opt.value = 'MUMBAI';
    opt.textContent = 'MUMBAI';
    select.appendChild(opt);
    select.value = 'MUMBAI';
    const f = getFilters(document);
    expect(f.branch).toBe('MUMBAI');
  });

  test('reads status filter value', () => {
    document.getElementById('filterStatus').value = 'BLOCK';
    const f = getFilters(document);
    expect(f.status).toBe('BLOCK');
  });

  test('reads KYC filter value', () => {
    document.getElementById('filterKYC').value = 'YES';
    const f = getFilters(document);
    expect(f.kyc).toBe('YES');
  });

  test('truncates date to YYYY-MM format', () => {
    document.getElementById('filterDateFrom').value = '2020-06-15';
    const f = getFilters(document);
    expect(f.dateFrom).toBe('2020-06');
  });
});

describe('resetFilters', () => {
  beforeEach(setupFilterDOM);

  test('resets all filters to defaults', () => {
    document.getElementById('filterCountry').value = 'INDIA';
    document.getElementById('filterBranch').value = 'BRANCH_A';
    document.getElementById('filterStatus').value = 'BLOCK';
    document.getElementById('filterKYC').value = 'YES';
    document.getElementById('filterDateFrom').value = '2020-01-01';
    document.getElementById('filterDateTo').value = '2020-12-31';

    resetFilters(document);

    expect(document.getElementById('filterCountry').value).toBe('');
    expect(document.getElementById('filterBranch').value).toBe('');
    expect(document.getElementById('filterStatus').value).toBe('');
    expect(document.getElementById('filterKYC').value).toBe('');
    expect(document.getElementById('filterDateFrom').value).toBe('2012-12-27');
    expect(document.getElementById('filterDateTo').value).toBe('2021-05-16');
  });
});

describe('populateFilters', () => {
  beforeEach(setupFilterDOM);

  test('adds country options to dropdown', () => {
    const countries = ['INDIA', 'CHINA', 'USA'];
    populateFilters(document, countries, []);

    const select = document.getElementById('filterCountry');
    // 1 default + 3 added
    expect(select.options.length).toBe(4);
    expect(select.options[1].value).toBe('INDIA');
    expect(select.options[2].value).toBe('CHINA');
    expect(select.options[3].value).toBe('USA');
  });

  test('adds branch options to dropdown', () => {
    const branches = ['BRANCH_A', 'BRANCH_B'];
    populateFilters(document, [], branches);

    const select = document.getElementById('filterBranch');
    // 1 default + 2 added
    expect(select.options.length).toBe(3);
    expect(select.options[1].value).toBe('BRANCH_A');
  });

  test('truncates long branch names in display text', () => {
    const longName = 'A'.repeat(50);
    populateFilters(document, [], [longName]);

    const select = document.getElementById('filterBranch');
    expect(select.options[1].value).toBe(longName);
    expect(select.options[1].textContent.length).toBeLessThan(longName.length);
    expect(select.options[1].textContent).toContain('…');
  });

  test('does not truncate short branch names', () => {
    populateFilters(document, [], ['SHORT']);

    const select = document.getElementById('filterBranch');
    expect(select.options[1].textContent).toBe('SHORT');
  });
});
