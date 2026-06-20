const { generateInsights } = require('../src/insights');

function sampleAgg() {
  return {
    total: 100,
    blocked: 20,
    active: 70,
    recent: 40,
    uniqueCountriesCount: 5,
    topCountries: [['INDIA', 50], ['CHINA', 30], ['USA', 20]],
    topBranches: [['BRANCH_A', 60], ['BRANCH_B', 40]],
    lovCount: { 0: 20, 1: 70, 2: 10 },
    kycCount: { 0: 30, 1: 70 },
    termCount: { 0: 40, 1: 35, 2: 25 },
    msmeCount: { 0: 55, 1: 45 },
    trendLabels: ['2020-01', '2020-02', '2020-03', '2020-04'],
    trendData: [10, 30, 25, 35],
  };
}

describe('generateInsights', () => {
  test('returns 5 insights by default', () => {
    const insights = generateInsights(sampleAgg());
    expect(insights).toHaveLength(5);
  });

  test('first insight mentions country count', () => {
    const insights = generateInsights(sampleAgg());
    expect(insights[0].text).toContain('5 countries');
  });

  test('second insight mentions top country name', () => {
    const insights = generateInsights(sampleAgg());
    expect(insights[1].text).toContain('INDIA');
  });

  test('second insight mentions top country customer count', () => {
    const insights = generateInsights(sampleAgg());
    expect(insights[1].text).toContain('50');
  });

  test('third insight mentions blocked percentage', () => {
    const insights = generateInsights(sampleAgg());
    expect(insights[2].text).toContain('20.0%');
  });

  test('fourth insight mentions cash percentage', () => {
    const insights = generateInsights(sampleAgg());
    // Cash = 40 / (40+35+25) = 40%
    expect(insights[3].text).toContain('40.0%');
  });

  test('fifth insight identifies peak month', () => {
    const insights = generateInsights(sampleAgg());
    expect(insights[4].text).toContain('2020-04');
    expect(insights[4].text).toContain('35');
  });

  test('returns 4 insights when topCountries is empty', () => {
    const agg = sampleAgg();
    agg.topCountries = [];
    const insights = generateInsights(agg);
    expect(insights).toHaveLength(4);
  });

  test('handles zero total gracefully', () => {
    const agg = {
      total: 0,
      blocked: 0,
      active: 0,
      recent: 0,
      uniqueCountriesCount: 0,
      topCountries: [],
      topBranches: [],
      lovCount: { 0: 0, 1: 0, 2: 0 },
      kycCount: { 0: 0, 1: 0 },
      termCount: { 0: 0, 1: 0, 2: 0 },
      msmeCount: { 0: 0, 1: 0 },
      trendLabels: [],
      trendData: [],
    };
    const insights = generateInsights(agg);
    expect(insights).toHaveLength(4);
    expect(insights[0].text).toContain('0 countries');
    expect(insights[1].text).toContain('0%');
  });

  test('each insight has icon, color, and text', () => {
    const insights = generateInsights(sampleAgg());
    insights.forEach(insight => {
      expect(insight).toHaveProperty('icon');
      expect(insight).toHaveProperty('color');
      expect(insight).toHaveProperty('text');
      expect(insight.icon).toMatch(/fa-solid/);
    });
  });

  test('peak month is N/A when no trend data', () => {
    const agg = sampleAgg();
    agg.trendLabels = [];
    agg.trendData = [];
    const insights = generateInsights(agg);
    const peakInsight = insights[insights.length - 1];
    expect(peakInsight.text).toContain('N/A');
  });
});
