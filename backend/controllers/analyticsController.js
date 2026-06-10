const { getPool, isMySQLEnabled } = require('../config/db');
const { getLocalProposals } = require('../utils/localDb');

function calculateAnalytics(proposals) {
  const total = proposals.length;

  if (total === 0) {
    return {
      totalProposals: 0,
      mostPopularPackage: 'N/A',
      mostPopularCity: 'N/A',
      trend: []
    };
  }

  const packageCounts = {};
  const cityCounts = {};
  const trendCounts = {};

  proposals.forEach((p) => {
    const pkg = p.packageType || 'Unknown';
    packageCounts[pkg] = (packageCounts[pkg] || 0) + 1;

    const city = p.city || 'Unknown';
    cityCounts[city] = (cityCounts[city] || 0) + 1;

    const dateStr = p.createdAt ? String(p.createdAt).split('T')[0] : 'Unknown';
    trendCounts[dateStr] = (trendCounts[dateStr] || 0) + 1;
  });

  let mostPopularPackage = 'N/A';
  let maxPackageCount = 0;

  for (const [pkg, count] of Object.entries(packageCounts)) {
    if (count > maxPackageCount) {
      maxPackageCount = count;
      mostPopularPackage = pkg;
    }
  }

  let mostPopularCity = 'N/A';
  let maxCityCount = 0;

  for (const [city, count] of Object.entries(cityCounts)) {
    if (count > maxCityCount) {
      maxCityCount = count;
      mostPopularCity = city;
    }
  }

  const trend = Object.entries(trendCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  return {
    totalProposals: total,
    mostPopularPackage,
    mostPopularCity,
    trend
  };
}

async function getAnalytics(req, res) {
  try {
    let proposalsList = [];

    if (isMySQLEnabled()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM proposals');

      proposalsList = rows.map((row) => {
        let parsedEvents = [];

        try {
          parsedEvents = JSON.parse(row.events);
        } catch (error) {
          parsedEvents = typeof row.events === 'string' ? row.events.split(',') : row.events;
        }

        return {
          id: row.id,
          coupleNames: row.couple_names,
          weddingDate: row.wedding_date,
          venue: row.venue,
          city: row.city,
          events: parsedEvents,
          packageType: row.package_type,
          specialRequests: row.special_requests,
          theme: row.theme,
          createdAt: row.created_at
        };
      });
    } else {
      proposalsList = await getLocalProposals();
    }

    const analytics = calculateAnalytics(proposalsList);
    res.json(analytics);
  } catch (error) {
    console.error('Error calculating analytics:', error);

    res.status(500).json({
      error: 'Failed to retrieve analytics dashboard data.'
    });
  }
}

module.exports = {
  getAnalytics
};