const { aggregate } = require('../src/aggregate');

const COUNTRIES = ['INDIA', 'CHINA', 'USA', 'GERMANY', 'JAPAN'];
const BRANCHES = ['BRANCH_A', 'BRANCH_B', 'BRANCH_C'];
const LOV_VALS = ['BLOCK', 'DISPLAY', 'HIDE', ''];

// Row format: [countryIdx, branchIdx, lovIdx, kycIdx, termIdx, msmeIdx, "YYYY-MM"]
const SAMPLE_ROWS = [
  [0, 0, 1, 1, 1, 0, '2019-06'], // INDIA, BRANCH_A, DISPLAY, YES, CREDIT, MSME_Y
  [0, 0, 0, 0, 0, 1, '2020-03'], // INDIA, BRANCH_A, BLOCK, NO, CASH, MSME_N
  [1, 1, 1, 1, 1, 0, '2020-05'], // CHINA, BRANCH_B, DISPLAY, YES, CREDIT, MSME_Y
  [2, 2, 1, 0, 2, 1, '2021-01'], // USA, BRANCH_C, DISPLAY, NO, PDC, MSME_N
  [0, 0, 2, 0, 0, 1, '2018-11'], // INDIA, BRANCH_A, HIDE, NO, CASH, MSME_N
  [3, 1, 0, 1, 1, 0, '2020-08'], // GERMANY, BRANCH_B, BLOCK, YES, CREDIT, MSME_Y
  [4, 2, 1, 1, 0, 0, '2019-12'], // JAPAN, BRANCH_C, DISPLAY, YES, CASH, MSME_Y
];

function defaultFilters() {
  return { country: '', branch: '', status: '', kyc: '', dateFrom: '', dateTo: '' };
}

describe('aggregate - basic counts', () => {
  test('counts total rows when no filters applied', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.total).toBe(7);
  });

  test('counts blocked customers (lovIdx === 0)', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.blocked).toBe(2);
  });

  test('counts active customers (lovIdx === 1)', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.active).toBe(4);
  });

  test('counts recent customers (>= 2020-01)', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    // Rows with ym >= '2020-01': 2020-03, 2020-05, 2021-01, 2020-08
    expect(result.recent).toBe(4);
  });

  test('counts unique countries', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.uniqueCountriesCount).toBe(5);
  });
});

describe('aggregate - country filter', () => {
  test('filters by country', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), country: 'INDIA' },
    });
    expect(result.total).toBe(3);
    expect(result.uniqueCountriesCount).toBe(1);
  });

  test('non-existent country in filter is treated as no filter (indexOf returns -1)', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), country: 'FRANCE' },
    });
    // indexOf('FRANCE') === -1, so cIdx === -1, filter not applied
    expect(result.total).toBe(7);
  });
});

describe('aggregate - branch filter', () => {
  test('filters by branch', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), branch: 'BRANCH_A' },
    });
    expect(result.total).toBe(3);
  });

  test('non-existent branch in filter is treated as no filter (indexOf returns -1)', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), branch: 'BRANCH_Z' },
    });
    // indexOf('BRANCH_Z') === -1, so bIdx === -1, filter not applied
    expect(result.total).toBe(7);
  });
});

describe('aggregate - status filter', () => {
  test('filters by BLOCK status', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), status: 'BLOCK' },
    });
    expect(result.total).toBe(2);
    expect(result.blocked).toBe(2);
    expect(result.active).toBe(0);
  });

  test('filters by DISPLAY status', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), status: 'DISPLAY' },
    });
    expect(result.total).toBe(4);
    expect(result.active).toBe(4);
  });

  test('filters by HIDE status', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), status: 'HIDE' },
    });
    expect(result.total).toBe(1);
  });
});

describe('aggregate - KYC filter', () => {
  test('filters by KYC YES', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), kyc: 'YES' },
    });
    expect(result.total).toBe(4);
  });

  test('filters by KYC NO', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), kyc: 'NO' },
    });
    expect(result.total).toBe(3);
  });
});

describe('aggregate - date filter', () => {
  test('filters by dateFrom', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), dateFrom: '2020-01' },
    });
    expect(result.total).toBe(4);
  });

  test('filters by dateTo', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), dateTo: '2019-12' },
    });
    expect(result.total).toBe(3);
  });

  test('filters by date range', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), dateFrom: '2020-01', dateTo: '2020-06' },
    });
    expect(result.total).toBe(2);
  });
});

describe('aggregate - combined filters', () => {
  test('combines country and status filter', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), country: 'INDIA', status: 'BLOCK' },
    });
    expect(result.total).toBe(1);
  });

  test('combines country, branch, and date filters', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: { ...defaultFilters(), country: 'INDIA', branch: 'BRANCH_A', dateFrom: '2019-01' },
    });
    expect(result.total).toBe(2);
  });
});

describe('aggregate - topCountries', () => {
  test('returns countries sorted by count descending', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.topCountries[0][0]).toBe('INDIA');
    expect(result.topCountries[0][1]).toBe(3);
  });

  test('limits to 15 countries', () => {
    const manyRows = [];
    for (let i = 0; i < 20; i++) {
      manyRows.push([i % 20, 0, 1, 1, 0, 0, '2020-01']);
    }
    const manyCountries = Array.from({ length: 20 }, (_, i) => `COUNTRY_${i}`);
    const result = aggregate({
      rows: manyRows,
      countries: manyCountries,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.topCountries.length).toBeLessThanOrEqual(15);
  });
});

describe('aggregate - topBranches', () => {
  test('returns branches sorted by count descending', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.topBranches[0][0]).toBe('BRANCH_A');
    expect(result.topBranches[0][1]).toBe(3);
  });
});

describe('aggregate - LOV count', () => {
  test('correctly counts LOV statuses', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.lovCount[0]).toBe(2); // BLOCK
    expect(result.lovCount[1]).toBe(4); // DISPLAY
    expect(result.lovCount[2]).toBe(1); // HIDE
  });
});

describe('aggregate - KYC count', () => {
  test('correctly counts KYC statuses', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.kycCount[0]).toBe(3); // NO
    expect(result.kycCount[1]).toBe(4); // YES
  });
});

describe('aggregate - term count', () => {
  test('correctly counts payment terms', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.termCount[0]).toBe(3); // CASH
    expect(result.termCount[1]).toBe(3); // CREDIT
    expect(result.termCount[2]).toBe(1); // PDC
  });
});

describe('aggregate - MSME count', () => {
  test('correctly counts MSME statuses', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.msmeCount[0]).toBe(4); // Y
    expect(result.msmeCount[1]).toBe(3); // N
  });
});

describe('aggregate - trend data', () => {
  test('returns sorted month labels', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    const labels = result.trendLabels;
    for (let i = 1; i < labels.length; i++) {
      expect(labels[i] >= labels[i - 1]).toBe(true);
    }
  });

  test('trend data matches label count', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.trendLabels.length).toBe(result.trendData.length);
  });

  test('trend data sums to total', () => {
    const result = aggregate({
      rows: SAMPLE_ROWS,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    const sum = result.trendData.reduce((a, b) => a + b, 0);
    expect(sum).toBe(result.total);
  });
});

describe('aggregate - edge cases with negative/out-of-range indices', () => {
  test('handles negative country index (ci < 0)', () => {
    const rows = [[-1, 0, 1, 1, 0, 0, '2020-01']];
    const result = aggregate({
      rows,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.total).toBe(1);
    expect(result.uniqueCountriesCount).toBe(0);
    expect(result.topCountries).toEqual([]);
  });

  test('handles negative branch index (bi < 0)', () => {
    const rows = [[0, -1, 1, 1, 0, 0, '2020-01']];
    const result = aggregate({
      rows,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.total).toBe(1);
    expect(result.topBranches).toEqual([]);
  });

  test('handles KYC index out of range (ki === 2)', () => {
    const rows = [[0, 0, 1, 2, 0, 0, '2020-01']];
    const result = aggregate({
      rows,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.kycCount[0]).toBe(0);
    expect(result.kycCount[1]).toBe(0);
  });

  test('handles term index out of range (ti === 3)', () => {
    const rows = [[0, 0, 1, 1, 3, 0, '2020-01']];
    const result = aggregate({
      rows,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.termCount[0]).toBe(0);
    expect(result.termCount[1]).toBe(0);
    expect(result.termCount[2]).toBe(0);
  });

  test('handles MSME index out of range (mi === 2)', () => {
    const rows = [[0, 0, 1, 1, 0, 2, '2020-01']];
    const result = aggregate({
      rows,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.msmeCount[0]).toBe(0);
    expect(result.msmeCount[1]).toBe(0);
  });

  test('handles empty ym string', () => {
    const rows = [[0, 0, 1, 1, 0, 0, '']];
    const result = aggregate({
      rows,
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.total).toBe(1);
    expect(result.trendLabels).toEqual([]);
    expect(result.trendData).toEqual([]);
  });
});

describe('aggregate - empty data', () => {
  test('handles empty rows', () => {
    const result = aggregate({
      rows: [],
      countries: COUNTRIES,
      branches: BRANCHES,
      lovVals: LOV_VALS,
      filters: defaultFilters(),
    });
    expect(result.total).toBe(0);
    expect(result.blocked).toBe(0);
    expect(result.active).toBe(0);
    expect(result.recent).toBe(0);
    expect(result.uniqueCountriesCount).toBe(0);
    expect(result.topCountries).toEqual([]);
    expect(result.topBranches).toEqual([]);
    expect(result.trendLabels).toEqual([]);
    expect(result.trendData).toEqual([]);
  });
});
